import React, { Dispatch, SetStateAction } from 'react'
import { createPortal } from 'react-dom'
import { css } from '@emotion/react'

import { closeButton, modalContainer, modalFormBox } from '../../../style/modal'
import { Close } from '../../atom/Close'
import { ModalContent } from './ModalContent'

import { SubmitProps } from '../../../types'

type Props = {
  id: string
  title: string
  content: string
  setTitle: Dispatch<SetStateAction<string>>
  setContent: Dispatch<SetStateAction<string>>
  func: ({ id, title, body }: SubmitProps) => Promise<void>
  toggle: () => void
}

export const FixedModal: React.FC<Props> = ({
  id,
  title,
  content,
  setTitle,
  setContent,
  func,
  toggle,
}) => {
  const app = document.getElementById('__next')
  if (!app) {
    return null
  }

  return createPortal(
    <div css={modalOverRay}>
      <div css={modalWrap}>
        <div css={modalContainer}>
          <button onClick={toggle} css={closeButton}>
            <Close />
          </button>
          <div css={modalFormBox}>
            <ModalContent
              id={id}
              title={title}
              content={content}
              setTitle={setTitle}
              setContent={setContent}
              func={func}
            />
          </div>
        </div>
      </div>
    </div>,
    app
  )
}
const modalOverRay = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  height: 100vh;
  width: 100vw;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.6);
`
const modalWrap = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
