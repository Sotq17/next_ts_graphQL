import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'

import {
  ADD_STAR_REPOSITORY,
  CREATE_ISSUE,
  GET_ISSUES,
  GET_REPOSITORIES,
  graphQLClient,
  REMOVE_STAR_REPOSITORY,
  UPDATE_ISSUE,
} from '../../graphQL'

import { RootState } from '..'
import {
  Issue,
  Issues,
  Repository,
  SubmitProps,
  SubmitPropsWithRepoId,
} from '../../types'

// 【関数】

// リポジトリ全体取得
export const fetchReposirories = createAsyncThunk(
  'repositries/get',
  async () => {
    const data = await graphQLClient.request(GET_REPOSITORIES)
    return data
  }
)
// 特定のリポジトリのIssue取得
export const fetchIssues = createAsyncThunk(
  'issues/get',
  async ({ id, limit }: { id: string; limit: number }) => {
    const variables = { id: id, limit: limit }
    const data = await graphQLClient.request(GET_ISSUES, variables)
    return data
  }
)
// issue追加取得
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
    return data
  }
)

// issue新規作成
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

// issue更新
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

// スター付与
export const addStar = createAsyncThunk('addStar', async (id: string) => {
  const variables = {
    id: id,
  }
  const data = await graphQLClient.request(ADD_STAR_REPOSITORY, variables)
  return data
})

// スター削除
export const removeStar = createAsyncThunk('removeStar', async (id: string) => {
  const variables = {
    id: id,
  }
  const data = await graphQLClient.request(REMOVE_STAR_REPOSITORY, variables)
  return data
})

// 【store管理】
const repoAdapter = createEntityAdapter<Repository>({
  selectId: Repository => Repository.id,
})

const repositorySlice = createSlice({
  name: 'repository',
  initialState: repoAdapter.getInitialState({ loading: false }),
  reducers: {},
  extraReducers: builder => {
    // リポジトリ全体取得
    builder
      .addCase(fetchReposirories.pending, state => {
        state.loading = true
      })
      .addCase(fetchReposirories.rejected, state => {
        state.loading = false
      })
      .addCase(fetchReposirories.fulfilled, (state, action) => {
        repoAdapter.setAll(state, action.payload.viewer.repositories.nodes)
        state.loading = false
      })

      // 特定のリポジトリのIssue取得
      .addCase(fetchIssues.pending, state => {
        state.loading = true
      })
      .addCase(fetchIssues.rejected, state => {
        state.loading = false
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        const { id, issues } = action.payload.node

        repoAdapter.updateOne(state, {
          id: id,
          changes: { issues: issues },
        })

        state.loading = false
      })

      // issue追加取得
      .addCase(fetchMoreIssues.fulfilled, (state, action) => {
        const { id, issues } = action.payload.node
        const currentIssues: Issues | undefined = current(
          state.entities[id]?.issues
        )

        if (!currentIssues) {
          return
        }
        const newData = issues
        const newIssues = {
          edges: currentIssues.edges
            ? [...currentIssues.edges, ...newData.edges]
            : newData.edges,
          totalCount: currentIssues.totalCount,
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
      .addCase(addIssue.rejected, state => {
        state.loading = false
      })
      .addCase(addIssue.fulfilled, (state, action) => {
        const { repositoryId, data } = action.payload
        const currentIssues: Issues | undefined = current(
          state.entities[repositoryId]?.issues
        )
        if (!currentIssues) {
          return
        }

        const newDataArray = [{ node: data.createIssue.issue }]

        const newIssuesArray = currentIssues?.edges
          ? [...newDataArray, ...currentIssues?.edges]
          : newDataArray

        const newIssues = {
          edges: newIssuesArray,
          totalCount: currentIssues.totalCount,
          pageInfo: currentIssues?.pageInfo,
        }

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
      .addCase(updateIssue.rejected, state => {
        state.loading = false
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        const { repositoryId, data } = action.payload

        const currentIssues: Issues | undefined = current(
          state.entities[repositoryId]?.issues
        )

        if (!currentIssues) {
          return
        }

        const updatedIssue = data.updateIssue
        const newIssuesArray = currentIssues?.edges.map((edge: Issue) => {
          if (edge.node.id === updatedIssue.issue.id) {
            return { node: updatedIssue.issue }
          } else {
            return edge
          }
        })

        const newIssues: Issues | undefined = {
          edges: newIssuesArray || currentIssues?.edges || [],
          totalCount: currentIssues.totalCount,
          pageInfo: currentIssues?.pageInfo,
        }

        repoAdapter.updateOne(state, {
          id: repositoryId,
          changes: { issues: newIssues },
        })

        state.loading = false
      })

      // スター付与
      .addCase(addStar.fulfilled, (state, action) => {
        repoAdapter.updateOne(state, {
          id: action.payload.addStar.starrable.id,
          changes: {
            stargazers: action.payload.addStar.starrable.stargazers,
            viewerHasStarred: action.payload.addStar.starrable.viewerHasStarred,
          },
        })
      })

      // スター削除
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
  },
})

export const selectRepositories = repoAdapter.getSelectors<RootState>(
  state => state.repository
)

export const selectRepositoriesLoading = (state: RootState) =>
  state.repository.loading

export default repositorySlice.reducer
