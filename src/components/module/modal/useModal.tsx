// モーダルのカスタムフック
// FixedModalと一緒に使用する

import { useState } from 'react'

export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false)

  const toggle = () => {
    setIsShowing(!isShowing)
  }

  return {
    isShowing,
    toggle,
  }
}
