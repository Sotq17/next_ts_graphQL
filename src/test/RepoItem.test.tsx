import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { RepoItem } from '../components/block/RepoItem'

import { GET_REPOSITORY } from '../graphQL'

const repo = {
  id: 'MDEwOlJlcG9zaXRvcnk0MDczMzM5MjQ=',
  name: 'next_ts_graphQL',
  stargazers: {
    totalCount: 1,
  },
  url: 'https://github.com/Sotq17/next_ts_graphQL',
  viewerHasStarred: true,
}

const mocks = [
  {
    request: {
      query: GET_REPOSITORY,
      variables: {
        id: 'repository_1',
      },
    },
    result: {
      data: {
        id: 'MDEwOlJlcG9zaXRvcnk0MDczMzM5MjQ=',
        name: 'next_ts_graphQL',
        stargazers: {
          totalCount: 1,
        },
        url: 'https://github.com/Sotq17/next_ts_graphQL',
        viewerHasStarred: true,
      },
    },
  },
]

describe('RepoItem', () => {
  test('renders RepoItem component', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RepoItem
          data={repo}
          refetch={() => {
            console.log('refetch')
          }}
          linkText='Home'
          linkHref='/'
        />
      </MockedProvider>
    )

    screen.debug()
  })
})
