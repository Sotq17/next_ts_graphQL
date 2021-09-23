import { useMutation } from '@apollo/client'
import { css } from '@emotion/react'
import Link from 'next/link'
import React from 'react'
import { ADD_STAR_REPOSITORY, REMOVE_STAR_REPOSITORY } from '../../graphQL'

export const RepoItem = ({ data, refetch }: any) => {
  const [addStar] = useMutation(ADD_STAR_REPOSITORY, {
    onCompleted() {
      refetch()
    },
  })
  const [removeStar] = useMutation(REMOVE_STAR_REPOSITORY, {
    onCompleted() {
      refetch()
    },
  })
  return (
    <li
      key={data.name}
      css={css`
        width: 100%;
        overflow-wrap: break-word;
      `}
    >
      <b>Repository: {data.name}</b>
      <p>URL: {data.url}</p>
      <p>Stars: {data.stargazers.totalCount || '0'}</p>
      {/* 既にstarしてあるかどうかで出し分け */}
      {!data.viewerHasStarred ? (
        <button
          onClick={() => {
            addStar({ variables: { id: data.id } })
          }}
        >
          star ☆
        </button>
      ) : (
        <button
          onClick={() => {
            removeStar({ variables: { id: data.id } })
          }}
        >
          unstar ★
        </button>
      )}
      <Link href={`./${data.id}`}>詳細</Link>
    </li>
  )
}
