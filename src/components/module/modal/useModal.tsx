// モーダルのカスタムフック
// FixedModalと一緒に使用する

import { Dispatch, SetStateAction, useState } from 'react'

type Props = {
  modalTitle: string
  setModalTitle: Dispatch<SetStateAction<string>>
  modalContent: string
  setModalContent: Dispatch<SetStateAction<string>>
  isShowing: boolean
  toggle: () => void
}

export const useModal = (): Props => {
  const [isShowing, setIsShowing] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')

  const toggle = () => {
    setIsShowing(!isShowing)
  }

  return {
    modalTitle,
    setModalTitle,
    modalContent,
    setModalContent,
    isShowing,
    toggle,
  }
}
