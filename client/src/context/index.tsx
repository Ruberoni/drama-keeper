import React, { createContext, useReducer, useContext, useMemo, useState } from 'react'
import Cookies from 'universal-cookie';
import Modal from '@material-ui/core/Modal';
import API from '../api'
import { IFormValues } from '../components/Register/Register'
import UpdateFilm from '../components/UpdateFilm/UpdateFilm'

const cookies = new Cookies();

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

export const AppContext = createContext<any>('e')

type AppProviderProps = {children: React.ReactNode}

function reducer(state: any/*: IAppContextState*/, action: any/*: IAppContextAction*/) {
  // to do: save component to render as modal. Not <Login /> but Login
  switch (action.type) {
    case 'FILM/ADD':
    case 'FILM/UPDATE':
    case 'FILM/DELETE':
      return {
        ...state,
        reloadFilms: true
      }
    case 'FILM/READY':
      return {
        ...state,
        reloadFilms: false
      }
    case 'LOGIN':
      return {
        ...state,
        authToken: action.token
      }
    case 'LOGOUT':
      return {
        ...state,
        authToken: null
      }
  }
}

export function AppProvider({ children }: AppProviderProps ) {
  const [state, dispatch] = useReducer(
      reducer, 
      { reloadFilms: false, authToken: null}
    )

  const app = useMemo(() => {
    return {state, dispatch}
  },[state, dispatch])


  const authFunctions = {
    /*
    * Post to API login URI. 
    * If OK then sets token cookie and context and return true
    * If ERROR returns err.message
    */
    login: async (userData: IFormValues) : Promise<boolean | string> => {
      try {

        const options = {
          email: userData.email,
          password: userData.password 
        }

        // Do POST fetch
        const response = await API.post('/api/auth/login', options)

        // Set cookie with token
        cookies.set('token', response.data.token)
        app.dispatch({type: 'LOGIN', token: response.data.token})
        alert("Logged in")
        return true
      } catch (err) {
        alert("Error: " + err.message)
        return err.message
      }
    },

    /*
    * Removes token from cookie and context
    */
    logout:  () => {
      cookies.remove('token')
      alert('Logged out')
      app.dispatch({type: 'LOGOUT'})
    }
  }

  const [open, setOpen] = React.useState<boolean>(false);
  const [modalComponent, setModalComponent] = useState<JSX.Element>(<div></div>)
  const handleClose = () => {
    setOpen(false);
  }; 

  const openUpdateFilmModal = (_id: string) => {
    setModalComponent(<UpdateFilm _id={_id}/>);  
    setOpen(true);
  };

  return (
    <AppContext.Provider value={{auth: authFunctions, openUpdateFilmModal, ...app}}>
      <SimpleModal open={open} onClose={handleClose} body={modalComponent}/>

      {children}
    </ AppContext.Provider>
  )
}

export function useApp() {
  const app = useContext(AppContext)

  if (app === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return app
}