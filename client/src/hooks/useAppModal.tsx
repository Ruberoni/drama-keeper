import React from 'react'
// useModal hook.
import useModal from './useModal'

// Components to render as modals.
import CreateFilm from '../components/CreateFilm/CreateFilm'
import Login from '../components/Login/Login'
import Register from '../components/Register/Register'
import UpdateFilm from '../components/UpdateFilm/UpdateFilm'

interface reducerStateProps {modal: JSX.Element, isOpen: boolean}
type reducerActionProps = 
  | {modal: 'LOGIN'}
  | {modal: 'REGISTER'}
  | {modal: 'UPDATE_FILM', _id: string}
  | {modal: 'CREATE_FILM'}
  | {modal: 'CLOSE'}
  | {modal: 'OPEN'}

const reducer = (state: reducerStateProps, action: reducerActionProps) => {
  switch (action.modal) {
    case 'LOGIN':
      return {modal: <Login />, isOpen: true};
    case 'REGISTER':
      return {modal: <Register />, isOpen: true};
    case 'UPDATE_FILM':
      return {modal: <UpdateFilm _id={action._id} />, isOpen: true};
    case 'CREATE_FILM':
      return {modal: <CreateFilm />, isOpen: true};
    case 'CLOSE': 
      return {...state, isOpen: false};
    case 'OPEN': 
      return {...state, isOpen: true};
  }
}  

type useAppModalProps = [() => JSX.Element, (action: reducerActionProps) => void]

/**
 * Wrapper of useModal hook for easily open a modal by just calling a function with the modal name.
 * 
 * Call it as: 'openWrapper({modal: 'LOGIN'})' to instant open the 'login' component as a modal 
 * See 'reducerActionProps' and 'reducer' for others possibles values.
 */
export default function useAppModal() : useAppModalProps {
  const [state, dispatch] = React.useReducer(reducer, { modal: <Login />, isOpen: false })
  const [Modal, open, ] = useModal()

  const ModalWrapper = React.useCallback(() => {
    return (
      <Modal>
        {state.modal}
      </Modal>
    )
  }, [state.modal, Modal]);

  const openWrapper = (action: reducerActionProps) => {
    dispatch(action)
    open()
  }
  
  return [ModalWrapper, openWrapper]
}