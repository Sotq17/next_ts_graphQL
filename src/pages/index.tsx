import type { NextPage } from 'next'
import { useMutation, useQuery } from '@apollo/client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  ADD_STAR_REPOSITORY,
  GET_REPOSITORIES,
  REMOVE_STAR_REPOSITORY,
} from '../graphQL'
import { Repository } from '../types'
import { Layout } from '../components/layout/Layout'
import { css } from '@emotion/react'
import { RepoItem } from '../components/block/RepoItem'

const FixedSpinner = dynamic(() => import('../components/block/FixedSpinner'), {
  ssr: false,
})

const Home: NextPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_REPOSITORIES)
  const repositories: Repository[] = data?.viewer.repositories?.nodes

  // if (error) return <p>Error: {JSON.stringify(error)}</p>
  return (
    <Layout>
      {loading && <FixedSpinner />}
      {error && <p>Error: {JSON.stringify(error)}</p>}
      <ul css={repositoryContainer}>
        {repositories?.map(repo => {
          return (
            <li key={repo.id}>
              <RepoItem
                data={repo}
                refetch={refetch}
                linkText='Detail'
                linkHref={`./${repo.id}`}
              />
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default Home

const repositoryContainer = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 40px;
`
