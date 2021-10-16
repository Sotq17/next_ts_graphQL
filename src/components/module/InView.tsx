import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
  func: () => void
}

export const InView: React.FC<Props> = ({ func, children }) => {
  // issue追加取得
  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView) {
      func()
    }
  }, [inView])
  return <div ref={ref}>{children}</div>
}
