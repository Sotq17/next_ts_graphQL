import React, { useState } from 'react'
import { css } from '@emotion/react'
import { Issue, Issues, SubmitProps } from '../../types'
import { useModal } from '../module/modal/useModal'
import { FixedModal } from '../module/modal/FixedModal'
import { closeButton, modalContainer, modalFormBox } from '../../style/modal'
import { Close } from '../atom/Close'
import { ModalContent } from '../module/modal/ModalContent'
import { ButtonSmall } from '../atom/ButtonSmall'
import { useMutation } from '@apollo/client'
import { UPDATE_ISSUE } from '../../graphQL'
import FixedSpinner from './FixedSpinner'

export type IssueItem = Issue & {
  issues: Issues
  setIssues: React.Dispatch<React.SetStateAction<Issues | undefined>>
}

export const IssueItem: React.FC<IssueItem> = ({ node, issues, setIssues }) => {
  // modal表示用
  const { isShowing, toggle } = useModal()

  const [editTitle, setEditTitle] = useState(node.title)
  const [editContent, setEditContent] = useState(node.body)

  const [updateIssue, { loading }] = useMutation(UPDATE_ISSUE)

  const submitIssue = async ({ id, title, body }: SubmitProps) => {
    const { data } = await updateIssue({
      variables: { id: id, title: title, body: body },
    })

    const updatedIssue = data.updateIssue
    const newIssues = issues.edges.map(edge => {
      if (edge.node.id === updatedIssue.issue.id) {
        return { node: updatedIssue.issue }
      } else {
        return edge
      }
    })

    setIssues({ edges: newIssues, pageInfo: updatedIssue.pageInfo })
    toggle()
  }

  return (
    <>
      {loading && <FixedSpinner />}
      {isShowing && (
        <FixedModal>
          <div css={modalContainer}>
            <button onClick={toggle} css={closeButton}>
              <Close />
            </button>
            <div css={modalFormBox}>
              <ModalContent
                id={node.id}
                title={editTitle}
                content={editContent}
                setTitle={setEditTitle}
                setContent={setEditContent}
                func={submitIssue}
              />
            </div>
          </div>
        </FixedModal>
      )}
      <div css={issueContainer}>
        <div css={issueTitleContainer}>
          <p css={issueTitle}>{node.title}</p>
          <div>
            <ButtonSmall text='Edit Issue' func={toggle} />
          </div>
        </div>

        <div css={issueBody}>
          <p css={issueBodyText}>{node.body}</p>
          <a
            css={issueBodyLink}
            href={node.url}
            target='_blank'
            rel='noreferrer'
          >
            detail (another window)
          </a>
        </div>
      </div>
    </>
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

const issueTitleContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-weight: bold;
  background: #00afc7;
  padding: 20px;
  border-radius: 10px 10px 0 0;
`
const issueTitle = css`
  color: #ffffff;
  font-weight: bold;
  width: 50%;
  line-height: 1.2;
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
