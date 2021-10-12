import { useEffect } from 'react'
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import dynamic from 'next/dynamic'
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

import { Repository, SubmitProps } from '../../types'

import { Layout } from '../../components/layout/Layout'
import { RepoItem } from '../../components/block/RepoItem'
import { useModal } from '../../components/module/modal/useModal'
import { FixedModal } from '../../components/module/modal/FixedModal'
import { Button } from '../../components/atom/Button'
import { IssueItem } from '../../components/block/IssueItem'

import { mediaPc } from '../../style/variables'
import { SpinnerSmall } from '../../components/atom/Spinner'

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
  // リポジトリ詳細
  const repo: Repository | undefined = repositories.find(
    (repo: Repository) => repo.name === id
  )

  // repositoriesが取得できていない場合→リポジトリ全体をfetch
  // 取得できている場合→issueをfetch
  const limit = 10
  useEffect(() => {
    if (repo?.issues?.edges.length) {
      return
    }
    if (!repo) {
      dispatch(fetchReposirories())
    } else {
      dispatch(fetchIssues({ id: repo?.id, limit: limit }))
    }
  }, [repo?.id])

  // 新規issue追加用modal
  const {
    isShowing,
    toggle,
    modalTitle,
    setModalTitle,
    modalContent,
    setModalContent,
  } = useModal()

  const submitIssue = async ({ id, title, body }: SubmitProps) => {
    dispatch(addIssue({ id: id, title: title, body: body }))
    setModalTitle('')
    setModalContent('')
    toggle()
  }

  // issue追加取得
  const { ref, inView } = useInView({
    threshold: 0,
  })

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
      {isShowing && repo && (
        <FixedModal
          id={repo.id}
          title={modalTitle}
          content={modalContent}
          setTitle={setModalTitle}
          setContent={setModalContent}
          func={submitIssue}
          toggle={toggle}
        />
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
                repo.issues.edges.map((issue, index) => {
                  return (
                    <li css={issueItemContainer} key={index}>
                      <IssueItem node={issue.node} repositoryId={repo.id} />
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
