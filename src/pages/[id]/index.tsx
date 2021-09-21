import type { NextPage } from 'next'
import { gql, useMutation, useQuery } from '@apollo/client'
import { css } from '@emotion/react'
import { Query, Mutation } from 'react-apollo'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

// リポジトリ取得
const GET_REPOSITORY = gql`
  query ($id: ID!) {
    node(id: $id) {
      ... on Repository {
        id
        name
        url
        description
        viewerHasStarred
        stargazers {
          totalCount
        }
        issues(last: 20) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`

const ADD_STAR_REPOSITORY = gql`
  mutation ($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`

const REMOVE_STAR_REPOSITORY = gql`
  mutation ($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`

const CREATE_ISSUE = gql`
  mutation ($id: ID!, $title: String, $body: String) {
    createIssue(input: { repositoryId: $id, title: $title, body: $body }) {
      issue {
        number
        body
      }
    }
  }
`

type Issue = {
  node: {
    id: string
    title: string
    url: string
  }
}

type Repository = {
  id: string
  name: string
  url: string
  description: string
  stargazers: { totalCount: number }
  viewerHasStarred: boolean
  issues: { edges: Issue[] }
}

const Detail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { loading, error, data, refetch } = useQuery(GET_REPOSITORY, {
    variables: { id: id },
  })
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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {JSON.stringify(error)}</p>
  const repo: Repository = data.node

  const submitIssue = ({ id, title, body }: any) => {
    createIssue({
      variables: { id: id, title: title, body: body },
    })
    setIssueTitle('')
    setIssueContent('')
  }

  return (
    <div>
      <Link href={`./`}>一覧</Link>
      <div key={repo.name}>
        <b>Repository: {repo.name}</b>
        <p>URL: {repo.url}</p>
        <p>Description: {repo.description || '--'}</p>
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

        {repo.issues.edges?.map((issue, index) => {
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
