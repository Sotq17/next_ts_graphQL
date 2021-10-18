import { GraphQLClient, gql } from 'graphql-request'

const endpoint = 'https://api.github.com/graphql'
const token = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN
export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${token}`,
  },
})

// リポジトリ取得
export const GET_REPOSITORIES = gql`
  query {
    viewer {
      repositories(
        orderBy: { field: CREATED_AT, direction: DESC }
        first: 8
        privacy: PUBLIC
      ) {
        nodes {
          id
          name
          url
          viewerHasStarred
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`

// リポジトリ詳細取得
export const GET_REPOSITORY = gql`
  query ($id: ID!, $limit: Int, $cursor: String) {
    node(id: $id) {
      ... on Repository {
        id
        name
        url
        viewerHasStarred
        stargazers {
          totalCount
        }
        issues(
          first: $limit
          after: $cursor
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          edges {
            node {
              id
              title
              body
              url
            }
          }
          pageInfo {
            startCursor
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`

// リポジトリ詳細取得
export const GET_ISSUES = gql`
  query ($id: ID!, $limit: Int, $cursor: String) {
    node(id: $id) {
      ... on Repository {
        id
        issues(
          first: $limit
          after: $cursor
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          totalCount
          edges {
            node {
              id
              title
              body
              url
            }
          }
          pageInfo {
            startCursor
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`

export const ADD_STAR_REPOSITORY = gql`
  mutation ($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`

export const REMOVE_STAR_REPOSITORY = gql`
  mutation ($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`

export const CREATE_ISSUE = gql`
  mutation ($id: ID!, $title: String, $body: String) {
    createIssue(input: { repositoryId: $id, title: $title, body: $body }) {
      issue {
        id
        title
        body
        url
      }
    }
  }
`

export const UPDATE_ISSUE = gql`
  mutation ($id: ID!, $title: String, $body: String) {
    updateIssue(input: { id: $id, title: $title, body: $body }) {
      issue {
        id
        title
        body
        url
      }
    }
  }
`
