import React from 'react'
import { css } from '@emotion/react'
import { Issue } from '../../types'

export const IssueItem: React.FC<Issue> = ({ node }) => {
  return (
    <div css={issueContainer}>
      <p css={issueTitle}>{node.title}</p>
      <div css={issueBody}>
        <p css={issueBodyText}>{node.body}</p>
        <a css={issueBodyLink} href={node.url} target='_blank' rel='noreferrer'>
          detail (another window)
        </a>
      </div>
    </div>
  )
}

const issueContainer = css`
  width: 100%;
  height: 100%;
  padding: 0px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgb(0 0 0 / 15%);
  overflow-wrap: break-word;
`
const issueTitle = css`
  display: flex;
  justify-content: space-between;
  align-issues: center;
  color: #ffffff;
  font-weight: bold;
  background: #00afc7;
  padding: 10px 20px;
  border-radius: 10px 10px 0 0;
`

const issueBody = css`
  padding: 20px;
`
const issueBodyText = css`
  margin-bottom: 15px;
  line-height: 1.2;
`

const issueBodyLink = css`
  color: #106dcb;
  text-decoration: underline;
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`
