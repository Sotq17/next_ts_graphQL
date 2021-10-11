import { useEffect, useState } from 'react'
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import dynamic from 'next/dynamic'

import { Repository, SubmitProps } from '../../types'

import { Layout } from '../../components/layout/Layout'
import { RepoItem } from '../../components/block/RepoItem'
import { useModal } from '../../components/module/modal/useModal'
import { FixedModal } from '../../components/module/modal/FixedModal'
import { Button } from '../../components/atom/Button'
import { Close } from '../../components/atom/Close'
import { IssueItem } from '../../components/block/IssueItem'
import { ModalContent } from '../../components/module/modal/ModalContent'

import { mediaPc } from '../../style/variables'
import { closeButton, modalContainer, modalFormBox } from '../../style/modal'
import { SpinnerSmall } from '../../components/atom/Spinner'
import { useInView } from 'react-intersection-observer'
import { useDispatch, useSelector } from 'react-redux'
import {
  addIssue,
  fetchIssues,
  fetchMoreIssues,
  fetchReposirories,
  selectRepositories,
  selectRepositoriesLoading,
} from '../../store/slices/repositorySlice'

const FixedSpinner = dynamic(
  () => import('../../components/block/FixedSpinner'),
  {
    ssr: false,
  }
)

const Detail: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { id } = router.query
  // リポジトリ全体のState
  const repositories: Repository[] = useSelector(selectRepositories.selectAll)
  const loading = useSelector(selectRepositoriesLoading)
  const repo: Repository | undefined = repositories.find(
    (repo: Repository) => repo.name === id
  )
  // repositoriesが取得できていない場合fetch
  useEffect(() => {
    if (!repo) {
      dispatch(fetchReposirories())
    } else {
      dispatch(fetchIssues({ id: repo?.id, limit: limit }))
    }
  }, [repo?.id])

  const limit = 5

  // 新規issue作成用
  const [issueTitle, setIssueTitle] = useState('')
  const [issueContent, setIssueContent] = useState('')

  // modal表示/非表示用
  const { isShowing, toggle } = useModal()
  const submitIssue = async ({ id, title, body }: SubmitProps) => {
    dispatch(addIssue({ id: id, title: title, body: body }))
    setIssueTitle('')
    setIssueContent('')
    toggle()
  }

  // 無限スクロール用
  const { ref, inView } = useInView({
    threshold: 0,
  })

  // issue追加
  useEffect(() => {
    if (!inView || !repo) {
      return
    }

    dispatch(
      fetchMoreIssues({
        id: repo?.id,
        limit: limit,
        cursor: repo?.issues?.pageInfo?.endCursor,
      })
    )
  }, [inView])

  return (
    <Layout>
      {loading && <FixedSpinner />}
      {/* {createLoading && <FixedSpinner />} */}
      {isShowing && (
        <FixedModal>
          <div css={modalContainer}>
            <button onClick={toggle} css={closeButton}>
              <Close />
            </button>
            <div css={modalFormBox}>
              {repo && (
                <ModalContent
                  id={repo.id}
                  title={issueTitle}
                  content={issueContent}
                  setTitle={setIssueTitle}
                  setContent={setIssueContent}
                  func={submitIssue}
                />
              )}
            </div>
          </div>
        </FixedModal>
      )}

      {repo && (
        <div css={detailContainer}>
          <div css={repoItemContainer}>
            <RepoItem data={repo} linkText='Home' linkHref='/' />
          </div>

          <div css={issuesContainer}>
            <div css={buttonContainer}>
              <Button text='New Issue' func={toggle} />
            </div>

            <ul>
              {repo?.issues?.edges &&
                repo?.issues?.edges.map((issue, index) => {
                  return (
                    <li css={issueItemContainer} key={index}>
                      <IssueItem
                        node={issue.node}
                        issues={repo.issues}
                        repositoryId={repo.id}
                      />
                    </li>
                  )
                })}
            </ul>
            {repo?.issues?.pageInfo?.hasNextPage && (
              <div css={spinnerWrap} ref={ref}>
                <SpinnerSmall />
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Detail

const detailContainer = css`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 830px;
`

const buttonContainer = css`
  width: 200px;
  margin: 0 auto 30px;
`

const repoItemContainer = css`
  height: 100%;
  max-width: 100%;
  margin: 0 auto 40px;
  ${mediaPc} {
    margin: 0 0 40px;
  }
`

const issuesContainer = css`
  width: 320px;
  margin: auto;
  ${mediaPc} {
    margin: 0;
  }
`

const issueItemContainer = css`
  margin-bottom: 30px;
  &:last-of-type {
    margin-bottom: 0px;
  }
`

const spinnerWrap = css`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-tems: center;
`
