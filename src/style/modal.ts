import { css } from '@emotion/react'
import { mediaPc } from './variables'

export const modalContainer = css`
  width: 280px;
  margin: auto;
  background: #ffffff;
  border-radius: 10px;
  padding: 20px 20px 40px;
  ${mediaPc} {
    width: 500px;
    padding: 30px 30px 40px;
  }
`
export const closeButton = css`
  border: none;
  background: #ffffff;
  cursor: pointer;
  margin: 0 0 0 auto;
  display: block;
`
// ちょっとサボる
export const modalFormBox = css`
  margin: 20px 0 10px;
  display: flex;
  flex-direction: column;
`

export const inputWrapper = css`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  input {
    height: 40px;
    width: 100%;
    background: #f2f5f9;
    border: 1px solid #c7c7c7;
    box-sizing: border-box;
    border-radius: 6px;
    padding-left: 10px;
    max-width: 360px;
  }
`

export const inputWrapperSecondary = css`
  position: relative;
  width: 100%;
  margin-bottom: 50px;
  textarea {
    height: 90px;
    width: 100%;
    background: #f2f5f9;
    border: 1px solid #c7c7c7;
    box-sizing: border-box;
    border-radius: 6px;
    padding-left: 10px;
  }
`
export const errorText = css`
  font-size: 12px;
  margin-top: 5px;
  color: #ff7676;
`
