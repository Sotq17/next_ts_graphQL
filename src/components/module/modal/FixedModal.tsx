import { createPortal } from 'react-dom'
import React from 'react'
import { css } from '@emotion/react'

type Props = {
  children?: React.ReactNode
}

export const FixedModal: React.FC<Props> = ({ children }) => {
  const app = document.getElementById('__next')
  if (!app) {
    return null
  }

  return createPortal(
    <div css={modalOverRay}>
      <div css={modalWrap}>{children}</div>
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
