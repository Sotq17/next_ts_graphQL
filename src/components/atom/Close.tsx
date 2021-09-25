import { css } from '@emotion/react'
import React from 'react'

export const Close: React.FC = () => {
  return <div css={close} />
}
const close = css`
  display: block;
  position: relative;
  width: 24px;
  height: 24px;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px; /* 棒の幅（太さ） */
    height: 24px; /* 棒の高さ */
    background: #333333;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px; /* 棒の幅（太さ） */
    height: 24px; /* 棒の高さ */
    background: #333333;
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`
