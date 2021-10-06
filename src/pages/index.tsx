import { css } from '@emotion/react'
import type { NextPage } from 'next'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'
import { GET_REPOSITORIES } from '../graphQL'

import { Repository } from '../types'

import { Layout } from '../components/layout/Layout'
import { RepoItem } from '../components/block/RepoItem'
import { mediaPc } from '../style/variables'
import { atom, useRecoilState } from 'recoil'
import { useEffect } from 'react'

const FixedSpinner = dynamic(() => import('../components/block/FixedSpinner'), {
  ssr: false,
})

const initialRepository: Repository[] = []

export const RepositoryState = atom({
  key: 'repository',
  default: initialRepository,
})

const Home: NextPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_REPOSITORIES)
  const [repositories, setRepositories] = useRecoilState(RepositoryState)
  useEffect(() => {
    setRepositories(data?.viewer.repositories?.nodes)
  }, [data])

  if (error) return <p>Error: {JSON.stringify(error)}</p>

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
                linkHref={`./${repo.name}`}
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 40px;
  ${mediaPc} {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
`
