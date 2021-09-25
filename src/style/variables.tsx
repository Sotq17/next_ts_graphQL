import { css } from '@emotion/react'

// color
export const clrTheme = '#062854'
export const clrLink = '#419bf0'
export const clrText = '#333333'
export const clrError = '#FF3737'
export const clrErrorLight = '#FFD4D4'

export const clrBack = '#f2f2f2'

export const clrWhite = '#ffffff'
export const clrBlack = '#393939'
export const clrGray = '#DFDEDE'
export const clrLightGray = '#F6F6F6'
export const clrDarkGray = '#9A9A9A'
export const clrBlue = '#468BE8'
export const clrLightBlue = '#0CD7D7'
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
