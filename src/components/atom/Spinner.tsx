import React from 'react'
import { css } from '@emotion/react'

export const Spinner: React.VFC = () => {
  return <div css={spinner} />
}

export const SpinnerSmall: React.VFC = () => {
  return <div css={spinnerSmall} />
}

const spinner = css`
  width: 50px;
  height: 50px;
  border: 10px solid #dddddd;
  border-top-color: #aaaaaa;
  border-radius: 50%;
  animation: 1s spin infinite linear;
  @keyframes spin {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(360deg);
    }
  }
`

const spinnerSmall = css`
  width: 16px;
  height: 16px;
  border: 8px solid #dddddd;
  border-top-color: #aaaaaa;
  border-radius: 50%;
  animation: 1s spin infinite linear;
  @keyframes spin {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(360deg);
    }
  }
`
