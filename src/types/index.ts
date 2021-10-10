import {
  ApolloError,
  ApolloQueryResult,
  NetworkStatus,
  OperationVariables,
} from '@apollo/client'
import { GraphQLError } from 'graphql'

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

export type RepositoryState = {
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

export type Refetch = (
  variables?: Partial<OperationVariables> | undefined
) => Promise<ApolloQueryResult<T>>

type T = {
  data: T
  errors?: readonly GraphQLError[] | undefined
  error?: ApolloError | undefined
  loading: boolean
  networkStatus: NetworkStatus
  partial?: boolean | undefined
}

export type SubmitProps = {
  id: string
  title: string
  body: string
}
