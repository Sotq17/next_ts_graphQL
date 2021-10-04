import { useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { ApolloQueryResult, useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/dist/client/router'
import dynamic from 'next/dynamic'
import { useInView } from 'react-intersection-observer'

import { CREATE_ISSUE, GET_REPOSITORY } from '../../graphQL'
import {
  Issues,
  Repository,
  RepositoryResponse,
  SubmitProps,
} from '../../types'

import { Layout } from '../../components/layout/Layout'
import { RepoItem } from '../../components/block/RepoItem'
import { useModal } from '../../components/module/modal/useModal'
import { FixedModal } from '../../components/module/modal/FixedModal'
import { Button } from '../../components/atom/Button'
import { Close } from '../../components/atom/Close'
import { IssueItem } from '../../components/block/IssueItem'
import { ModalContent } from '../../components/module/modal/ModalContent'
import { SpinnerSmall } from '../../components/atom/Spinner'

import { mediaPc } from '../../style/variables'
import { closeButton, modalContainer, modalFormBox } from '../../style/modal'

const FixedSpinner = dynamic(
  () => import('../../components/block/FixedSpinner'),
  {
    ssr: false,
  }
)

const Detail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  // リポジトリ全体のState
  const [repo, setRepo] = useState<Repository>()
  // issue配列のState
  const [issues, setIssues] = useState<Issues>()
  const limit = 5
  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_REPOSITORY,
    {
      variables: { id: id, limit: limit },
      fetchPolicy: 'no-cache',
    }
  )
  // data更新時の反映 (ex.star,unstar)
  useEffect(() => {
    setRepo(data?.node)
    if (!issues?.edges.length) {
      setIssues(data?.node?.issues)
    }
  }, [data])

  // 無限スクロール用
  const renderFlgRef = useRef(false)
  const { ref, inView } = useInView({
    threshold: 0,
  })
  // 追加issue表示
  const getMoreIssue = async () => {
    if (!issues) {
      return
    }
    const { data }: ApolloQueryResult<RepositoryResponse> = await fetchMore({
      variables: { cursor: issues?.pageInfo?.endCursor },
    })
    const newData = data.node?.issues
    const newIssues = {
      edges: issues.edges ? [...issues.edges, ...newData.edges] : newData.edges,
      pageInfo: newData.pageInfo,
    }
    setIssues(newIssues)
  }
  // issue追加発火
  useEffect(() => {
    if (renderFlgRef.current) {
      if (inView) {
        getMoreIssue()
      }
    } else {
      renderFlgRef.current = true
    }
  }, [inView])

  // 新規issue作成用
  const [issueTitle, setIssueTitle] = useState('')
  const [issueContent, setIssueContent] = useState('')
  const [createIssue, { loading: createLoading }] = useMutation(CREATE_ISSUE)

  // modal表示/非表示用
  const { isShowing, toggle } = useModal()
  const submitIssue = async ({ id, title, body }: SubmitProps) => {
    const result = await createIssue({
      variables: { id: id, title: title, body: body },
    })
    const newIssues = {
      edges: issues?.edges
        ? [{ node: result.data.createIssue.issue }, ...issues?.edges]
        : [{ node: result.data.createIssue.issue }],
      pageInfo: issues?.pageInfo,
    }
    setIssues(newIssues)
    setIssueTitle('')
    setIssueContent('')
    toggle()
  }

  if (error) return <p>Error: {JSON.stringify(error)}</p>

  return (
    <Layout>
      {loading && <FixedSpinner />}
      {createLoading && <FixedSpinner />}
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
            <RepoItem
              data={repo}
              refetch={refetch}
              linkText='Home'
              linkHref='/'
            />
          </div>

          <div css={issuesContainer}>
            <div css={buttonContainer}>
              <Button text='New Issue' func={toggle} />
            </div>

            <ul css={issueList}>
              {issues?.edges?.map((issue, index) => {
                return (
                  <li css={issueItemContainer} key={index}>
                    <IssueItem
                      node={issue.node}
                      issues={issues}
                      setIssues={setIssues}
                    />
                  </li>
                )
              })}
            </ul>
            {issues?.pageInfo?.hasNextPage && (
              <div css={spinnerWrap} id='fetchMoreButton' ref={ref}>
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
const issueList = css``

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
