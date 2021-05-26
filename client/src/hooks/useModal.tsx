import React, {useState} from 'react'
import Modal from '@material-ui/core/Modal';
import UpdateFilm from '../components/UpdateFilm/UpdateFilm'

export interface ISimpleModal {
  open: boolean, 
  onClose: () => void,
  // eslint-disable-next-line no-undef
  body: JSX.Element
}

function SimpleModal({open, onClose, body} : ISimpleModal) {

  return (
    <Modal
      className='modal'
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );

}

export default function useModal(open: boolean, setOpen: (a: boolean) => void) : [JSX.Element | undefined, (modal: string, extraParams?: {_id?: string}) => void]{

  // const [component, setComponent] = useState<JSX.Element | undefined>()
  const [opens, setOpens] = useState<boolean>(open);
  const [modal, setModal] = useState<JSX.Element | undefined>()

  // type IOpenModal = (modal: string, extraParams?: {_id?: string}) => void
  const handleClose = () => {
    console.log('handleClose')
    setOpens(false);
  };

  function openModal (modal: string, extraParams?: {_id?: string}) : void {
    console.log('holaa')
    console.log('modal:', modal, ' and extraParams:', extraParams && extraParams)
    if (modal === 'update' && extraParams?._id) {
      console.log('inside')

      // setComponent(<UpdateFilm _id={extraParams._id}/>)
      const component = (<UpdateFilm _id={extraParams._id}/>)
      setOpen(true)
      setModal(<SimpleModal open={opens} onClose={handleClose} body={component}/>)
    }
  }


  // const modal = component && <SimpleModal open={open} onClose={handleClose} body={component}/>
  
  return [modal, openModal]

}