import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'

import { RootState } from '.'
import {
  ADD_STAR_REPOSITORY,
  CREATE_ISSUE,
  GET_ISSUES,
  GET_REPOSITORIES,
  graphQLClient,
  REMOVE_STAR_REPOSITORY,
  UPDATE_ISSUE,
} from '../../graphQL'
import {
  FIXME,
  Issue,
  Issues,
  Repository,
  SubmitProps,
  SubmitPropsWithRepoId,
} from '../../types'

// リポジトリ全体取得
export const fetchReposirories = createAsyncThunk(
  'repositries/get',
  async () => {
    const data = await graphQLClient.request(GET_REPOSITORIES)
    // console.log(JSON.stringify(data, undefined, 2))
    return data
  }
)
// 特定のリポジトリのIssue取得
export const fetchIssues = createAsyncThunk(
  'issues/get',
  async ({ id, limit }: { id: string; limit: number }) => {
    const variables = { id: id, limit: limit }
    const data = await graphQLClient.request(GET_ISSUES, variables)
    // console.log(JSON.stringify(data, undefined, 2))
    return data
  }
)
// issue追加
export const fetchMoreIssues = createAsyncThunk(
  'moreIssues/get',
  async ({
    id,
    limit,
    cursor,
  }: {
    id: string
    limit: number
    cursor: string | undefined
  }) => {
    const variables = { id: id, limit: limit, cursor: cursor }
    const data = await graphQLClient.request(GET_ISSUES, variables)
    // console.log(JSON.stringify(data, undefined, 2))
    return data
  }
)

export const addIssue = createAsyncThunk(
  'addIssue',
  async ({ id, title, body }: SubmitProps) => {
    const variables = {
      id: id,
      title: title,
      body: body,
    }
    const data = await graphQLClient.request(CREATE_ISSUE, variables)
    const res = {
      data: data,
      repositoryId: id,
    }
    return res
  }
)

export const updateIssue = createAsyncThunk(
  'updateIssue',
  async ({ id, title, repositoryId, body }: SubmitPropsWithRepoId) => {
    const variables = {
      id: id,
      title: title,
      body: body,
    }
    const data = await graphQLClient.request(UPDATE_ISSUE, variables)
    const res = {
      data: data,
      repositoryId: repositoryId,
    }
    return res
  }
)

export const addStar = createAsyncThunk('addStar', async (id: string) => {
  const variables = {
    id: id,
  }
  const data = await graphQLClient.request(ADD_STAR_REPOSITORY, variables)
  return data
})

export const removeStar = createAsyncThunk('removeStar', async (id: string) => {
  const variables = {
    id: id,
  }
  const data = await graphQLClient.request(REMOVE_STAR_REPOSITORY, variables)
  return data
})

const repoAdapter = createEntityAdapter<Repository>({
  selectId: Repository => Repository.id,
})

const repositorySlice = createSlice({
  name: 'repository',
  initialState: repoAdapter.getInitialState({ loading: false }),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchReposirories.pending, state => {
        state.loading = true
      })
      .addCase(fetchReposirories.rejected, state => {
        state.loading = false
      })
      .addCase(fetchReposirories.fulfilled, (state, action) => {
        state.loading = false
        repoAdapter.setAll(state, action.payload.viewer.repositories.nodes)
      })

      .addCase(addStar.fulfilled, (state, action) => {
        repoAdapter.updateOne(state, {
          id: action.payload.addStar.starrable.id,
          changes: {
            stargazers: action.payload.addStar.starrable.stargazers,
            viewerHasStarred: action.payload.addStar.starrable.viewerHasStarred,
          },
        })
      })

      .addCase(removeStar.fulfilled, (state, action) => {
        repoAdapter.updateOne(state, {
          id: action.payload.removeStar.starrable.id,
          changes: {
            stargazers: action.payload.removeStar.starrable.stargazers,
            viewerHasStarred:
              action.payload.removeStar.starrable.viewerHasStarred,
          },
        })
      })

      // issue取得
      .addCase(fetchIssues.pending, state => {
        state.loading = true
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        const { id, issues } = action.payload.node
        state.loading = false

        // const newIssues: FIXME = getNewIssues({ issues })

        repoAdapter.updateOne(state, {
          id: id,
          changes: { issues: issues },
          // changes: { issues: newIssues },
        })
      })

      // issue追加取得
      .addCase(fetchMoreIssues.fulfilled, (state, action) => {
        const { id, issues } = action.payload.node
        const currentIssues: Issues | undefined = current(
          state.entities[id]?.issues
        )

        const newData = issues
        const newIssues = {
          edges: currentIssues?.edges
            ? [...currentIssues?.edges, ...newData.edges]
            : newData.edges,
          pageInfo: newData.pageInfo,
        }

        repoAdapter.updateOne(state, {
          id: id,
          changes: { issues: newIssues },
        })
      })

      // issue作成
      .addCase(addIssue.pending, state => {
        state.loading = true
      })
      .addCase(addIssue.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(addIssue.fulfilled, (state, action) => {
        const { repositoryId, data } = action.payload
        const currentIssues: Issues | undefined = current(
          state.entities[repositoryId]?.issues
        )
        const newArray = currentIssues?.edges.map(item => item)
        const newIssuesArray = newArray
          ? [{ node: data.createIssue.issue }].concat(currentIssues?.edges)
          : [{ node: data.createIssue.issue }]

        const newIssues: FIXME = {
          edges: newIssuesArray,
          pageInfo: currentIssues?.pageInfo,
        }
        console.log(newIssues)

        // const newIssues = getNewIssues({ newIssue, currentIssues })
        repoAdapter.updateOne(state, {
          id: repositoryId,
          changes: { issues: newIssues },
        })

        state.loading = false
      })

      // issue変更
      .addCase(updateIssue.pending, state => {
        state.loading = true
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        const { repositoryId, data } = action.payload

        const currentIssues: Issues | undefined = current(
          state.entities[repositoryId]?.issues
        )

        const updatedIssue = data.updateIssue
        const newIssuesArray = currentIssues?.edges.map((edge: Issue) => {
          if (edge.node.id === updatedIssue.issue.id) {
            return { node: updatedIssue.issue }
          } else {
            return edge
          }
        })

        const newIssues: FIXME = {
          edges: newIssuesArray,
          pageInfo: currentIssues?.pageInfo,
        }

        repoAdapter.updateOne(state, {
          id: repositoryId,
          changes: { issues: newIssues },
        })

        state.loading = false
      })
  },
})

// export const selectRepositories = (state: RootState) => state.repository.items
export const selectRepositories = repoAdapter.getSelectors<RootState>(
  state => state.repository
)

export const selectRepositoriesLoading = (state: RootState) =>
  state.repository.loading

export default repositorySlice.reducer
