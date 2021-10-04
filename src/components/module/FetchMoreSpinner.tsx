import React, { useEffect, useRef } from 'react'
import { ApolloQueryResult } from '@apollo/client'
import { css } from '@emotion/react'
import { useInView } from 'react-intersection-observer'

import { Issues, RepositoryResponse } from '../../types'
import { SpinnerSmall } from '../atom/Spinner'

type FetchMoreArgs = {
  variables: {
    cursor: string | undefined
  }
}
type Props = {
  issues: Issues
  setIssues: React.Dispatch<React.SetStateAction<Issues | undefined>>
  fetchMore: ({
    variables,
  }: FetchMoreArgs) => Promise<ApolloQueryResult<RepositoryResponse>>
}

export const FetchMoreSpinner: React.FC<Props> = ({
  issues,
  setIssues,
  fetchMore,
}) => {
  // 無限スクロール用
  const renderFlgRef = useRef(false)
  const { ref, inView } = useInView({
    threshold: 0,
  })

  // 追加issue表示
  const getMoreIssue = async () => {
    if (!issues) {
      return
    }
    const { data } = await fetchMore({
      variables: { cursor: issues?.pageInfo?.endCursor },
    })
    const newData = data.node?.issues
    const newIssues = {
      edges: issues.edges ? [...issues.edges, ...newData.edges] : newData.edges,
      pageInfo: newData.pageInfo,
    }
    setIssues(newIssues)
  }

  // issue追加発火
  useEffect(() => {
    if (renderFlgRef.current) {
      if (inView) {
        getMoreIssue()
      }
    } else {
      renderFlgRef.current = true
    }
  }, [inView])
  return (
    <div css={spinnerWrap} ref={ref}>
      <SpinnerSmall />
    </div>
  )
}

const spinnerWrap = css`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-tems: center;
`
