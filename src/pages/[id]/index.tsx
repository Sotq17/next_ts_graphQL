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

type Repository = {
  id: string
  name: string
  url: string
  description: string
  stargazers: { totalCount: number }
  viewerHasStarred: boolean
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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {JSON.stringify(error)}</p>
  console.log(data)
  const repo: Repository = data.node

  return (
    <div>
      <Link href={`./`}>一覧</Link>
      <div key={repo.name}>
        <b>Repository: {repo.name}</b>
        <p>URL: {repo.url}</p>
        <p>Description: {repo.description || '-'}</p>
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
      </div>
    </div>
  )
}

export default Detail
