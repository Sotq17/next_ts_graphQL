import TestRenderer from 'react-test-renderer'
import { MockedProvider } from '@apollo/client/testing'
import { RepoItem } from '../components/block/RepoItem'
import { GET_REPOSITORY } from '../graphQL'
import { useQuery } from '@apollo/client'
import { Repository } from '../types'

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

it('renders without error', () => {
  const component = TestRenderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RepoItem />
    </MockedProvider>
  )

  const tree = component.toJSON()
  expect(tree.children).toContain('Loading...')
})
