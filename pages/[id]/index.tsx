import type { NextPage } from 'next'
import {gql, useMutation, useQuery} from '@apollo/client';
import {Query, Mutation} from 'react-apollo';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';


// リポジトリ取得
const GET_REPOSITORY = gql`
  query {
    viewer {
      repositories(last: 3,privacy: PUBLIC) {
        nodes {
          id
          name
          url
          description
          viewerHasStarred
          stargazers{
              totalCount
            }
        }
      }
    }
  }
`;

const ADD_STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

type Repository = {
  id: string;
  name: string;
  url: string;
  description: string;
  stargazers: { totalCount: number }
  viewerHasStarred:boolean
}

const Detail: NextPage = () => {

  const router = useRouter()
  const { id } = router.query

  return <p>ID: {id}</p>

  return <div>


      </div>

}

export default Detail
