import React from 'react'

import { css } from '@emotion/react'
import { addStar, removeStar } from '../../store/slices/repositorySlice'
import { useDispatch } from 'react-redux'

type Props = {
  id: string
  hasStarred: boolean
}

export const Star: React.FC<Props> = ({ id, hasStarred }) => {
  const dispatch = useDispatch()
  return (
    <>
      {hasStarred ? (
        <button
          css={[icon]}
          onClick={() => {
            dispatch(addStar(id))
          }}
        />
      ) : (
        <button
          css={[icon, isStarred]}
          onClick={() => {
            dispatch(removeStar(id))
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
