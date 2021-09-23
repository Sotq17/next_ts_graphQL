// 画面に固定されるSpinner
// API通信時など、ユーザーの操作を止めたい場合に使用する
import { css } from '@emotion/react'
import { Spinner } from '../atom/Spinner'
import { createPortal } from 'react-dom'

const FixedSpinner: React.FC = () => {
  const app = document.getElementById('__next')
  if (!app) {
    return <div />
  }

  return createPortal(
    <div css={spinnerOverRay}>
      <div css={spinnerWrap}>
        <Spinner />
      </div>
    </div>,
    app
  )
}

export default FixedSpinner

const spinnerOverRay = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  height: 100vh;
  width: 100vw;
  z-index: 999;
  background-color: rgba(245, 245, 245, 0.5);
`
const spinnerWrap = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
