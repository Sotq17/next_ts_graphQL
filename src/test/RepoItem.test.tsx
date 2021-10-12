import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import { RepoItem } from '../components/block/RepoItem'

import store from '../store'

const repo = {
  id: 'MDEwOlJlcG9zaXRvcnk0MDczMzM5MjQ=',
  name: 'next_ts_graphQL',
  stargazers: {
    totalCount: 1,
  },
  url: 'https://github.com/Sotq17/next_ts_graphQL',
  viewerHasStarred: true,
  issues: {
    edges: [
      {
        node: {
          body: '33',
          id: 'I_kwDOGEdsJM48_Pgo',
          title: '33',
          url: 'https://github.com/Sotq17/ne',
        },
      },
    ],
    pageInfo: {
      endCursor: 'Y3Vyc29yOnYyOpK5MjAyMS0xMC0xMVQyMDoyODowMSswOTowMM4883fl',
      hasNextPage: true,
      startCursor: 'Y3Vyc29yOnYyOp',
    },
  },
}

describe('RepoItem', () => {
  test('renders RepoItem component', () => {
    render(
      <Provider store={store}>
        <RepoItem data={repo} linkText='Home' linkHref='/' />
      </Provider>
    )

    screen.debug()
  })
})
