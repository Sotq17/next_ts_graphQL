import { css } from '@emotion/react'
import React, { useState } from 'react'
import {
  errorText,
  inputWrapper,
  inputWrapperSecondary,
} from '../../../style/modal'
import { Button } from '../../atom/Button'

type Parameter = {
  id: string
  title: string
  body: string
}

type Props = {
  id: string
  title: string
  content: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  setContent: React.Dispatch<React.SetStateAction<string>>
  func: ({ id, title, body }: Parameter) => void
}

export const ModalContent: React.FC<Props> = ({
  id,
  title,
  content,
  setTitle,
  setContent,
  func,
}) => {
  const [titleError, setTitleError] = useState(false)
  const [contentError, setContentError] = useState(false)
  const submitContent = () => {
    if (!title) {
      setTitleError(true)
    }
    if (!content) {
      setContentError(true)
    }
    if (title && content) {
      func({
        id: id,
        title: title,
        body: content,
      })
    }
  }
  return (
    <>
      <div css={inputWrapper}>
        <input
          type='text'
          value={title}
          placeholder='issue title'
          onChange={e => {
            if (titleError) {
              setTitleError(false)
            }
            setTitle(e.target.value)
          }}
        />
        {titleError && <p css={errorText}>title is required</p>}
      </div>
      <div css={inputWrapperSecondary}>
        <textarea
          value={content}
          placeholder='issue body'
          onChange={e => {
            if (contentError) {
              setContentError(false)
            }
            setContent(e.target.value)
          }}
        />
        {contentError && <p css={errorText}>content is required</p>}
      </div>
      <div css={modalButtonContainer}>
        <Button text='Submit' func={submitContent} />
      </div>
    </>
  )
}

const modalButtonContainer = css`
  width: 280px;
  margin: auto;
`
