import type { NextPage } from 'next'
import {gql, useMutation, useQuery} from '@apollo/client';
import {Query, Mutation} from 'react-apollo';
import { useEffect, useState } from 'react';


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

const Home: NextPage = () => {

  const { loading, error, data } = useQuery(GET_REPOSITORY);
  const [addStar] = useMutation(ADD_STAR_REPOSITORY);
  const [removeStar] = useMutation(REMOVE_STAR_REPOSITORY);

  // const repositories: Repository[] = data.viewer.repositories?.nodes;
  const [repositories, setRepositries] = useState<Repository[]>()
  useEffect(() => {
    if (!loading && data) {
      setRepositries(data.viewer.repositories?.nodes)
    }
  }, [loading, data])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  console.log({ data })


  return <div>
    {repositories?.map((repo) => {
          return (
            <div key={repo.name}>
              <b>Repository: {repo.name}</b>
              <p>URL: {repo.url}</p>
              <p>Description: {repo.description || '-'}</p>
              <p>Stars: {repo.stargazers.totalCount || '0'}</p>
               {/* 既にstarしてあるかどうかで出し分け */}
              {!repo.viewerHasStarred ? (
                <button onClick={() => {addStar({ variables: { id: repo.id } })}}>star ☆</button>
              ) : (
                <button onClick={()=>{removeStar({ variables: { id: repo.id } })}}>unstar ★</button>
              )}
            </div>)
        })}

      </div>

}

export default Home
