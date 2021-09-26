import React from 'react'
import Link from 'next/link'
import { css } from '@emotion/react'

type Props = {
  text: string
  func?: () => void
  link?: string
  disabled?: boolean
}

export const Button: React.FC<Props> = ({ text, func, link, disabled }) => {
  let btnDom = (
    <button css={button} onClick={func} disabled={disabled}>
      <p css={buttonText}>{text}</p>
    </button>
  )
  if (link) {
    btnDom = <Link href={link}>{btnDom}</Link>
  }
  return btnDom
}

const button = css`
  position: relative;
  z-index: 1;
  border-radius: 2em;
  padding: 15px;
  width: 100%;
  background: linear-gradient(89.91deg, #00afc7 3.01%, #00dda8 99.84%);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
  border-radius: 56px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const buttonText = css`
  font-size: 18px;
  line-height: 21px;
  font-family: YuGothic;
  color: #ffffff;
`
