import React, {useState} from 'react'
import Modal from '@material-ui/core/Modal';

type ModalWrapperProps = {children: JSX.Element}

export default function useModal() : [({ children }: ModalWrapperProps) => JSX.Element, () => void, () => void, boolean] {

  const [isOpen, setOpen] = useState<boolean>(false);
  const open = React.useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const close = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const ModalWrapper = React.useCallback(({children} : ModalWrapperProps) => {
    return (
      <Modal
        className='modal'
        open={isOpen}
        onClose={close}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {children}
      </Modal>
    )
  }, [isOpen, close]);

  return [ModalWrapper, open, close, isOpen]
}