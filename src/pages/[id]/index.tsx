import type { NextPage } from 'next'
import { useMutation, useQuery } from '@apollo/client'
import { css } from '@emotion/react'
import { useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import {
  ADD_STAR_REPOSITORY,
  CREATE_ISSUE,
  GET_REPOSITORY,
  REMOVE_STAR_REPOSITORY,
} from '../../graphQL'
import { Repository } from '../../types'
import dynamic from 'next/dynamic'
import { Layout } from '../../components/layout/Layout'
import { RepoItem } from '../../components/block/RepoItem'

const FixedSpinner = dynamic(
  () => import('../../components/block/FixedSpinner'),
  {
    ssr: false,
  }
)

type SubmitProps = {
  id: string
  title: string
  body: string
}

const Detail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { loading, error, data, refetch } = useQuery(GET_REPOSITORY, {
    variables: { id: id },
  })
  const repo: Repository = data?.node

  const [issueTitle, setIssueTitle] = useState('')
  const [issueContent, setIssueContent] = useState('')

  const [createIssue] = useMutation(CREATE_ISSUE, {
    onCompleted() {
      refetch()
    },
  })

  const submitIssue = ({ id, title, body }: SubmitProps) => {
    createIssue({
      variables: { id: id, title: title, body: body },
    })
    setIssueTitle('')
    setIssueContent('')
  }

  // if (error) return <p>Error: {JSON.stringify(error)}</p>

  return (
    <Layout>
      {loading && <FixedSpinner />}

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
            {repo.issues?.edges?.map((issue, index) => {
              return (
                <div key={index}>
                  <p>{issue.node.title}</p>
                  <a href={issue.node.url} target='_blank' rel='noreferrer'>
                    detail (another window)
                  </a>
                </div>
              )
            })}
            <button
              onClick={() => {
                submitIssue({
                  id: repo.id,
                  title: issueTitle,
                  body: issueContent,
                })
              }}
            >
              new issue
            </button>

            <input
              type='text'
              value={issueTitle}
              onChange={e => {
                setIssueTitle(e.target.value)
              }}
            />
            <textarea
              value={issueContent}
              onChange={e => {
                setIssueContent(e.target.value)
              }}
            />
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
`

const repoItemContainer = css``

const issuesContainer = css``
