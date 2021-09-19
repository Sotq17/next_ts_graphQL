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

  const { loading, error, data, refetch } = useQuery(GET_REPOSITORY);
  const [addStar] = useMutation(ADD_STAR_REPOSITORY, {
  onCompleted() {
    refetch();
  },
});
  const [removeStar] = useMutation(REMOVE_STAR_REPOSITORY, {
    onCompleted() {
      refetch();
    }
  })


  // const [repositories, setRepositries] = useState<Repository[]>()
  // useEffect(() => {
  //   console.log({data})
  //   if (!loading && data) {
  //     setRepositries(data.viewer.repositories?.nodes)
  //   }
  // }, [loading, data])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;
  const repositories: Repository[] = data.viewer.repositories?.nodes;

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
