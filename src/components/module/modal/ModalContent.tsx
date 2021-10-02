import { css } from '@emotion/react'
import React from 'react'
import { Button } from '../../atom/Button'

type Props = {
  id: string
  title: string
  content: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  setContent: React.Dispatch<React.SetStateAction<string>>
  func: (any: any) => void
}

export const ModalContent: React.FC<Props> = ({
  id,
  title,
  content,
  setTitle,
  setContent,
  func,
}) => {
  return (
    <>
      <input
        type='text'
        value={title}
        placeholder='issue title'
        onChange={e => {
          setTitle(e.target.value)
        }}
      />
      <textarea
        value={content}
        placeholder='issue body'
        onChange={e => {
          setContent(e.target.value)
        }}
      />

      <div css={modalButtonContainer}>
        <Button
          text='Submit'
          func={() =>
            func({
              id: id,
              title: title,
              body: content,
            })
          }
        />
      </div>
    </>
  )
}

const modalButtonContainer = css`
  width: 280px;
  margin: auto;
`
