import type { NextPage } from 'next'
import {gql, useQuery} from '@apollo/client';
import { useEffect, useState } from 'react';


// 発行する GraphQL クエリ
const GET_REPOSITORY = gql`
  query {
    viewer {
      repositories(
        last: 3
        privacy: PUBLIC

      ) {
        nodes {
          name
          url
          description
        }
      }
    }
  }
`;

type Repository = {
  name: string;
  url: string;
  description: string;
}

const Home: NextPage = () => {

const { loading, error, data } = useQuery(GET_REPOSITORY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  console.log({error})
  console.log({ data })


  const repositories = data.viewer.repositories?.nodes;


  return<div>
        {repositories.map((repository: Repository) => {
          return (
            <div key={repository.name}>
              <b>Repository: {repository.name}</b>
              <p>URL: {repository.url}</p>
              <p>Description: {repository.description || '-'}</p>
            </div>)
        })}
      </div>

}

export default Home
