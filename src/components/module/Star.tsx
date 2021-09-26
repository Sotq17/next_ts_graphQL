import React from 'react'
import { useMutation } from '@apollo/client'
import { css } from '@emotion/react'

import { ADD_STAR_REPOSITORY, REMOVE_STAR_REPOSITORY } from '../../graphQL'

import { Refetch } from '../../types'

type Props = {
  id: string
  hasStarred: boolean
  refetch?: Refetch
}

export const Star: React.FC<Props> = ({ id, hasStarred, refetch }) => {
  const [addStar] = useMutation(ADD_STAR_REPOSITORY, {
    onCompleted() {
      refetch && refetch()
    },
  })
  const [removeStar] = useMutation(REMOVE_STAR_REPOSITORY, {
    onCompleted() {
      refetch && refetch()
    },
  })

  return (
    <>
      {/* 既にstarしてあるかどうかで出し分け */}
      {hasStarred ? (
        <button
          css={[icon]}
          onClick={() => {
            addStar({ variables: { id: id } })
          }}
        />
      ) : (
        <button
          css={[icon, isStarred]}
          onClick={() => {
            removeStar({ variables: { id: id } })
          }}
        />
      )}
    </>
  )
}

const icon = css`
  cursor: pointer;
  color: #d3d3d3;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
  transition: color 0.2s ease;
  &:before {
    content: '★';
    font-size: 1.6rem;
  }
`
const isStarred = css`
  color: #ffa500;
  transition: color 0.1s ease;
`
