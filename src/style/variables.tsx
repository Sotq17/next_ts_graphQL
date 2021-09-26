import { css } from '@emotion/react'

// メディアクエリ
export const mediaSp = '@media (max-width: 768px)'
export const mediaPc = '@media (min-width: 768px)'

export const onlyPc = css`
  display: none;
  ${mediaPc} {
    display: block;
  }
`
export const onlySp = css`
  display: block;
  ${mediaPc} {
    display: none;
  }
`
