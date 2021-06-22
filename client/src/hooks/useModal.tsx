import React, {useState} from 'react'
import Modal from '@material-ui/core/Modal';

type ModalWrapperProps = {children: JSX.Element}

/**
 * Hook for easy implement a fully working modal anywhere.
 *
 * @returns {[Modal, open, close, isOpen]}
 *  'Modal'  the component, put as childrens of this component the content you want as a modal
 *  'open'   function for open the modal
 *  'close'  function for close open manually
 *  'isOpen' boolean indicating if the modal is opened or not
 */
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