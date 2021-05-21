import React, { useState, useEffect} from 'react';
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
import './App.css';
// import FilmItem from './components/FilmItem/FilmItem'
import TopBar from './components/TopBar/TopBar'
import CreateFilm from './components/CreateFilm/CreateFilm'
import Login from './components/Login/Login'
// import UpdateFilm from './components/UpdateFilm/UpdateFilm'
import Register from './components/Register/Register'
import UpdateFilm from './components/UpdateFilm/UpdateFilm'
import FilmItemList from './components/FilmItemList/FilmItemList'
import Typography from "@material-ui/core/Typography";
// import { IFilm } from './components/FilmItem/FilmItem'
import Modal from '@material-ui/core/Modal';
import Cookies from 'universal-cookie';
// import * as filmActions from './actions/films' 
// import * as utils from './utils/index'
// import { IFilm } from './components/FilmItem/FilmItem'
import { useInterval } from './hooks/useInterval'
import useFilms from './hooks/useFilms'
// import { IFormValues } from './components/Register/Register'
// import API from './api'
import { useApp } from "./context"

const cookies = new Cookies();

const theme = createMuiTheme({
  palette: {
    primary: red
  }
})

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

/*
export interface IFilmsReduced {
  toSee: IFilm[],
  seen: IFilm[]
}

const reducer = (films: IFilmsReduced, action: {films: IFilm[]}) => {

    return {
      toSee: action.films.filter(film => film.watched === false),
      seen: action.films.filter(film => film.watched === true)
    }
}
*/
// Gonna move this to ./context
// export const AppContext = createContext<any>('e')

// export interface IAppContextState {
//   reloadFilms: boolean
// }

// export interface IAppContextAction {
//   type: string
// }


// function reducer(state: any/*: IAppContextState*/, action: any/*: IAppContextAction*/) {
//   // to do: save authToken
//   // to do: save component to render as modal. Not <Login /> -> Login
//   switch (action.type) {
//     case 'FILM/ADD':
//     case 'FILM/UPDATE':
//     case 'FILM/DELETE':
//       return {
//         ...state,
//         reloadFilms: true
//       }
//     case 'FILM/READY':
//       return {
//         ...state,
//         reloadFilms: false
//       }
//     case 'LOGIN':
//       return {
//         ...state,
//         authToken: action.token
//       }
//     case 'LOGOUT':
//       return {
//         ...state,
//         authToken: null
//       }
//   }
// }

function MyApp() {

  const [open, setOpen] = useState<boolean>(false);
  // eslint-disable-next-line no-undef
  const [modalComponent, setModalComponent] = useState<JSX.Element>(<div></div>)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  // const [auth, setAuth] = useState<boolean>(false)
  const app = useApp()
  // useEffect(() => {
  //   // const _isAuth = utils.isAuth()
  //   const token = cookies.get('token')
  //   if (token) {
  //     setAuth(true)
  //     app.dispatch({type: 'LOGIN', token: token}) // Calling this reloads the app so the useEffect is again called

  //   } else {
  //     setAuth(false)
  //     app.dispatch({type: 'LOGOUT'})
  //   }
  // }, [])


  useEffect(() => {
    const token = cookies.get('token')
    if (!token && app.state.authToken) {
      // setAuth(false)
      app.dispatch({type: 'LOGOUT'})

    }
    if (token && !app.state.authToken) {
      // setAuth(true)
      app.dispatch({type: 'LOGIN', token: token}) // Calling this reloads the app so the useEffect is again called
    }
  })
  /*
  useEffect(() => {
    // const _isAuth = utils.isAuth()
    if (auth) {
      // setAuth(true)
      app.dispatch({type: 'LOGIN', token: token}) // Calling this reloads the app so the useEffect is again called

    } else {
      // setAuth(false)
      app.dispatch({type: 'LOGOUT'})
    }
  }, [auth])
  */
  const [films, reloadFilms] = useFilms()

  // const [films, reloadFilms] = useFilms()
  /*
  useEffect(() => {
    
    if (app.state.authToken) {
      [films, reloadFilms] = useFilms(app.state.authToken)
    }
    
    reloadFilms()
  }, [app.state.authToken])
  */

  useInterval(() => {
    if (app.state.authToken) {
      reloadFilms()
    }
  }, 30000)

  useEffect(() => {
    if (app?.state?.reloadFilms) {
      reloadFilms()
      app.dispatch({type: 'FILM/READY'})
    }

    /*
    if (!app.state.reloadFilms) {
      
    }
    */

  }, [app.state?.reloadFilms])

  /*
    I call dispatch(films)
    and it separate films with watched = true and those with watched = false
    then returns an object as {toSee: IFilm[], seen: IFilm[]}
    so i can call films.toSee or films.seen
  */

  // const [films, setFilms] = useState<IFilm[]>([])
  // const [films, setFilms] = useReducer(reducer, {toSee: [], seen: []})
  // useEffect(() => {
  //    getFilms()
  // }, [auth])
  // Fetch films by user
  // Response template: Film[]
  // where Film = {User: , Title: , Watched: , Links: , Cover: } 

  // const handleLogin = ()


  const openLoginModal = () => {
    setModalComponent(<Login />);  
    setOpen(true);
  };

  const openRegisterModal = () => {
    setModalComponent(<Register />);  
    setOpen(true);
  };
 
  const openCreateFilmModal = () => {
    setModalComponent(<CreateFilm />);  
    setOpen(true);
  };

  const openUpdateFilmModal = (_id: string) => {
    setModalComponent(<UpdateFilm _id={_id}/>);  
    setOpen(true);
  };
  
  const topBarActions = {
    login: openLoginModal,
    register: openRegisterModal,
    createFilm: openCreateFilmModal
  }

  const handleClose = () => {
    setOpen(false);
    reloadFilms()
  };

  // const authFunctions = {
  //   /*
  //   * Post to API login URI. 
  //   * If OK then sets token cookie and return true
  //   * If ERROR returns err.message
  //   */
  //   login: async (userData: IFormValues) : Promise<boolean | string> => {
  //     try {

  //       const options = {
  //         email: userData.email,
  //         password: userData.password 
  //       }

  //       // Do POST fetch
  //       const response = await API.post('/api/auth/login', options)
  //       alert(response.data.message)

  //       // Set cookie with token
  //       cookies.set('token', response.data.token)
  //       app.dispatch({type: 'LOGIN', token: response.data.token})
  //       return true
  //     } catch (err) {
  //       return err.message
  //     }
  //   },

  //   /*
  //   * Removes token cookie
  //   */
  //   logout:  () => {
  //     // const cookies = new Cookies(); //  Remove this and test
  //     cookies.remove('token')
  //     alert('Logged out')
  //     app.dispatch({type: 'LOGOUT'})

  //   }

  // }

  /*
    Using this:
    value={{triggerAppUpdate: reloadFilms, triggerFilmUpdate: openUpdateFilmModal}}
    As context value means that I need an useReducer
    Reducer prototype:
    case 'FILM/ADD' or 'FILM_ADDED':
    case 'FILM/UPDATE':
    case 'FILM/DELETE':
      isLoading: true
    case 'APP_READY':
      isLoading: false

    So I listen to isLoading here in App.tsx with an useEffect(function, [state.isLoading])
    and in the function body I should call reloadFilms()
  */
  return (
      <ThemeProvider theme={theme}>
        <SimpleModal open={open} onClose={handleClose} body={modalComponent}/>
        <div className='App'>
          <TopBar actions={topBarActions}/>
          <div className='FilmItemListWrapper'>
            <FilmItemList header='To see' filmList={films.data.filter(film => film.watched === false) /*[{}]*/} />
            <FilmItemList header='Seen' filmList={films.data.filter(film => film.watched === true)} />
          </div>
        </div>
        <Typography className='credit'>Made by Ruben</Typography>
      </ThemeProvider>
  )
}

export default MyApp;