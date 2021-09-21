import type { NextPage } from 'next'
import { useMutation, useQuery } from '@apollo/client'
import Link from 'next/link'
import {
  ADD_STAR_REPOSITORY,
  GET_REPOSITORIES,
  REMOVE_STAR_REPOSITORY,
} from '../graphQL'
import { Repository } from '../types'

const Home: NextPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_REPOSITORIES)
  const repositories: Repository[] = data?.viewer.repositories?.nodes
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
  return (
    <div>
      {repositories?.map(repo => {
        return (
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
            <Link href={`./${repo.id}`}>詳細</Link>
          </div>
        )
      })}
    </div>
  )
}

export default Home
