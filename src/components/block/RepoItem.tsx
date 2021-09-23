import { css } from '@emotion/react'
import Link from 'next/link'
import React from 'react'
import { Refetch, Repository } from '../../types'
import { Star } from '../module/Star'

type Props = {
  data: Repository
  refetch: Refetch
}

export const RepoItem: React.FC<Props> = ({ data, refetch }) => {
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
      <Star
        id={data.id}
        hasStarred={!data.viewerHasStarred}
        refetch={refetch}
      />
      <Link href={`./${data.id}`}>詳細</Link>
    </li>
  )
}
