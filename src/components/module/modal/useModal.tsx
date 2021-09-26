// モーダルのカスタムフック
// FixedModalと一緒に使用する

import { useState } from 'react'

type Props = {
  isShowing: boolean
  toggle: () => void
}

export const useModal = (): Props => {
  const [isShowing, setIsShowing] = useState(false)

  const toggle = () => {
    setIsShowing(!isShowing)
  }

  return {
    isShowing,
    toggle,
  }
}
