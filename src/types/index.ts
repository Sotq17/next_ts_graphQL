import { ApolloQueryResult, OperationVariables } from '@apollo/client'

export type Issue = {
  node: {
    id: string
    title: string
    body: string
    url: string
  }
}

export type Repository = {
  id: string
  name: string
  url: string
  stargazers: { totalCount: number }
  viewerHasStarred: boolean
  issues?: { edges: Issue[] }
}

export type Refetch = (
  variables?: Partial<OperationVariables> | undefined
) => Promise<ApolloQueryResult<any>>

export type SubmitProps = {
  id: string
  title: string
  body: string
}
