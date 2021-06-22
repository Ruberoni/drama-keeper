import React, { createContext, useReducer, useContext, useMemo } from 'react'
import Cookies from 'universal-cookie';
// import Modal from '@material-ui/core/Modal';
import API from '../api'
import { IFormValues } from '../components/Register/Register'
import useAppModal from '../hooks/useAppModal'

const cookies = new Cookies();

export const AppContext = createContext<any>('e')

type AppProviderProps = {children: React.ReactNode}

type reloadFilmsReason = 'CREATE' | 'UPDATE' | 'DELETE'

function reducer(state: any/*: IAppContextState*/, action: any/*: IAppContextAction*/) {
  // to do: save component to render as modal. Not <Login /> but Login
  switch (action.type) {
    case 'FILM/RELOAD':
    case 'FILM/CREATE':
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
    },
  }
  const reloadFilms = (reason: reloadFilmsReason) => {
    // I could use 'reason' to display like a simple inobstrusive popup.
    app.dispatch({type: 'FILM/RELOAD'})
  }


  const [AppModal, openAppModal] = useAppModal()

  return (
    <AppContext.Provider value={{auth: authFunctions, openAppModal, reloadFilms, ...app}}>
      <AppModal />

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