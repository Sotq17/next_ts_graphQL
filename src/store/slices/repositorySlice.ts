import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  current,
} from '@reduxjs/toolkit'
import { RootState } from '.'
import {
  ADD_STAR_REPOSITORY,
  GET_ISSUES,
  GET_REPOSITORIES,
  graphQLClient,
  REMOVE_STAR_REPOSITORY,
} from '../../graphQL'
import { Issue, Issues, Repository } from '../../types'

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
  async ({
    id,
    limit,
    cursor,
  }: {
    id: string
    limit: number
    cursor?: any
  }) => {
    const variables = { id: id, limit: limit }
    const data = await graphQLClient.request(GET_ISSUES, variables)
    // console.log(JSON.stringify(data, undefined, 2))
    return data
  }
)

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

      .addCase(fetchIssues.pending, state => {
        state.loading = true
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        const { id, issues } = action.payload.node
        state.loading = false
        console.log({ issues })

        repoAdapter.updateOne(state, {
          id: id,
          changes: { issues: issues },
        })
      })

      .addCase(fetchMoreIssues.fulfilled, (state, action) => {
        const { id, issues } = action.payload.node
        const currentIssues: Issues | undefined = current(
          state.entities[id]?.issues
        )

        const newIssues: Issues | undefined = {
          edges: currentIssues
            ? currentIssues?.edges.concat(issues.edges)
            : issues.edges,
          pageInfo: issues?.pageInfo,
        }
        console.log({ newIssues })

        repoAdapter.updateOne(state, {
          id: id,
          changes: { issues: newIssues },
        })
      })
  },
})

// export const selectRepositories = (state: RootState) => state.repository.items
export const selectRepositories = repoAdapter.getSelectors<RootState>(
  state => state.repository
)

export const selectRepositoriesLoading = (state: RootState) =>
  state.repository.loading

// export const selectRepositoriesLoading = (state: RootState) =>
//   state.repository.loading

export default repositorySlice.reducer
