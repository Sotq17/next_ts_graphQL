import { css } from '@emotion/react'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import {
  fetchReposirories,
  selectRepositories,
  selectRepositoriesLoading,
} from '../store/slices/repositorySlice'

import { Repository } from '../types'

import { Layout } from '../components/layout/Layout'
import { RepoItem } from '../components/block/RepoItem'
import { mediaPc } from '../style/variables'

const FixedSpinner = dynamic(() => import('../components/block/FixedSpinner'), {
  ssr: false,
})

const Home: NextPage = () => {
  const repositories: Repository[] = useSelector(selectRepositories.selectAll)
  const loading = useSelector(selectRepositoriesLoading)

  const dispatch = useDispatch()

  useEffect(() => {
    if (repositories.length) {
      return
    }
    dispatch(fetchReposirories())
  }, [])

  return (
    <Layout>
      {loading && <FixedSpinner />}
      <ul css={repositoryContainer}>
        {repositories?.map(repo => {
          return (
            <li key={repo.id}>
              <RepoItem
                data={repo}
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
