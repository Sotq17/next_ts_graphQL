import React from 'react'
import { css } from '@emotion/react'
import Link from 'next/link'

import { Star } from '../module/Star'

import { Repository } from '../../types'

type Props = {
  data: Repository
  linkText: string
  linkHref: string
}

export const RepoItem: React.FC<Props> = ({ data, linkText, linkHref }) => {
  return (
    <div key={data.name} css={itemContainer}>
      <div css={itemTitle}>
        <p>{data.name}</p>
        <Star id={data.id} hasStarred={!data.viewerHasStarred} />
      </div>
      <div css={itemBody}>
        <p css={itemBodyText}>URL: {data.url}</p>
        <p css={itemBodyText}>Stars: {data.stargazers.totalCount || '0'}</p>
        {data.issues?.totalCount && (
          <p css={itemBodyText}>issueCount:{data.issues.totalCount}</p>
        )}
        <Link href={linkHref}>
          <a css={itemBodyLink}>{linkText}</a>
        </Link>
      </div>
    </div>
  )
}

const itemContainer = css`
  width: 100%;
  height: 100%;
  padding: 0px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgb(0 0 0 / 15%);
  overflow-wrap: break-word;
`
const itemTitle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-weight: bold;
  background: #106dcb;
  padding: 20px;
  border-radius: 10px 10px 0 0;
`

const itemBody = css`
  padding: 20px;
`
const itemBodyText = css`
  margin-bottom: 15px;
  line-height: 1.2;
  word-break: break-word;
  width: 100%;
`

const itemBodyLink = css`
  color: #106dcb;
  text-decoration: underline;
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`
