import React from 'react'
import { css } from '@emotion/react'

export const Layout: React.FC = ({ children }) => {
  return <div css={layout}>{children}</div>
}

const layout = css`
  width: 80%;
  margin: 80px auto 30px;
`
