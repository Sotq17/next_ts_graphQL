import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { css } from '@emotion/react'

import { updateIssue } from '../../store/slices/repositorySlice'

import { Issue, SubmitProps } from '../../types'

import { ButtonSmall } from '../atom/ButtonSmall'
import { useModal } from '../module/modal/useModal'
import { FixedModal } from '../module/modal/FixedModal'

export type IssueItem = Issue & {
  repositoryId: string
}

export const IssueItem: React.FC<IssueItem> = ({ node, repositoryId }) => {
  const dispatch = useDispatch()

  // modal表示/非表示用
  const {
    isShowing,
    toggle,
    modalTitle,
    setModalTitle,
    modalContent,
    setModalContent,
  } = useModal()

  useEffect(() => {
    setModalTitle(node.title)
    setModalContent(node.body)
  }, [node])

  // 更新されたissueをissues配列に反映
  const submitIssue = async ({ id, title, body }: SubmitProps) => {
    dispatch(
      updateIssue({
        id: id,
        repositoryId: repositoryId,
        title: title,
        body: body,
      })
    )
    toggle()
  }

  return (
    <>
      {isShowing && (
        <FixedModal
          id={node.id}
          title={modalTitle}
          content={modalContent}
          setTitle={setModalTitle}
          setContent={setModalContent}
          func={submitIssue}
          toggle={toggle}
        />
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
