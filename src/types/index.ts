import { GraphQLError } from 'graphql'

export type FIXME = any

export type Issue = {
  node: {
    id: string
    title: string
    body: string
    url: string
  }
}

export type Issues = {
  edges: Issue[]
  pageInfo?: {
    endCursor: string
    hasNextPage: boolean
    startCursor: string
  }
}

export type Repository = {
  id: string
  name: string
  url: string
  stargazers: { totalCount: number }
  viewerHasStarred: boolean
  issues: Issues
}

export type RepositoryResponse = {
  node: Repository
}

export type SubmitProps = {
  id: string
  title: string
  body: string
}

export type SubmitPropsWithRepoId = {
  id: string
  title: string
  body: string
  repositoryId: string
}
