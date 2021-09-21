import { gql } from '@apollo/client'

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
  query ($id: ID!) {
    node(id: $id) {
      ... on Repository {
        id
        name
        url
        viewerHasStarred
        stargazers {
          totalCount
        }
        issues(last: 20) {
          edges {
            node {
              id
              title
              url
            }
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
      }
    }
  }
`

export const CREATE_ISSUE = gql`
  mutation ($id: ID!, $title: String, $body: String) {
    createIssue(input: { repositoryId: $id, title: $title, body: $body }) {
      issue {
        number
        body
      }
    }
  }
`