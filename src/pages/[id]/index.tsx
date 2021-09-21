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

  const [addStar] = useMutation(ADD_STAR_REPOSITORY, {
    onCompleted() {
      refetch()
    },
  })
  const [removeStar] = useMutation(REMOVE_STAR_REPOSITORY, {
    onCompleted() {
      refetch()
    },
  })
  const [createIssue] = useMutation(CREATE_ISSUE, {
    onCompleted() {
      refetch()
    },
  })

  const [issueTitle, setIssueTitle] = useState('')
  const [issueContent, setIssueContent] = useState('')

  const submitIssue = ({ id, title, body }: SubmitProps) => {
    createIssue({
      variables: { id: id, title: title, body: body },
    })
    setIssueTitle('')
    setIssueContent('')
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {JSON.stringify(error)}</p>

  return (
    <div>
      <Link href={`./`}>一覧</Link>
      <div key={repo.name}>
        <b>Repository: {repo.name}</b>
        <p>URL: {repo.url}</p>
        <p>Stars: {repo.stargazers.totalCount || '0'}</p>
        {/* 既にstarしてあるかどうかで出し分け */}
        {!repo.viewerHasStarred ? (
          <button
            onClick={() => {
              addStar({ variables: { id: repo.id } })
            }}
          >
            star ☆
          </button>
        ) : (
          <button
            onClick={() => {
              removeStar({ variables: { id: repo.id } })
            }}
          >
            unstar ★
          </button>
        )}

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
            submitIssue({ id: repo.id, title: issueTitle, body: issueContent })
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
  )
}

export default Detail
