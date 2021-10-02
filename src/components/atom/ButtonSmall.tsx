import React from 'react'
import Link from 'next/link'
import { css } from '@emotion/react'

type Props = {
  text: string
  func?: () => void
  link?: string
  disabled?: boolean
}

export const ButtonSmall: React.FC<Props> = ({
  text,
  func,
  link,
  disabled,
}) => {
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
  padding: 7px 30px;
  width: 100%;
  background: linear-gradient(89.91deg, #00afc7 3.01%, #00dda8 99.84%);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
  border-radius: 56px;
  text-align: center;
  border: none;
  cursor: pointer;
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    box-sizing: border-box;
    border-radius: 2em;
    padding: 2px;
    width: 100%;
    height: 100%;
    background: #fff;
    background-clip: content-box;
    content: '';
  }
`

const buttonText = css`
  font-family: YuGothic;
  font-weight: bold;
  font-size: 14px;
  line-height: 21px;
  color: #00afc7;
  background: linear-gradient(89.91deg, #00afc7 3.01%, #00dda8 99.84%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
