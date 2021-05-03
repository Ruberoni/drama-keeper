import React, { useState, useEffect } from 'react';
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
import FilmItemList from './components/FilmItemList/FilmItemList'
import Typography from "@material-ui/core/Typography";
// import { IFilm } from './components/FilmItem/FilmItem'
import Modal from '@material-ui/core/Modal';
import * as filmActions from './actions/films' 
import * as utils from './utils/index'
import { IFilm } from './components/FilmItem/FilmItem'

// const fakeData = {
//   filmList1: [{title: 'hola'}, {title: 'como'}, {title: 'estas'}, {title: 'ddd'}, {title: 'eee'}, {title: 'fff'}],
//   filmList2: [{title: 'aaa'}, {title: 'bbb'}, {title: 'ccc'}]
// }

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

  // const body = (
  //   <div>
  //     <h2 id="simple-modal-title">Text in a modal</h2>
  //     <p id="simple-modal-description">
  //       Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
  //     </p>
  //   </div>
  // );

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

function MyApp() {

  const [open, setOpen] = useState<boolean>(false);
  // eslint-disable-next-line no-undef
  const [modalComponent, setModalComponent] = useState<JSX.Element>(<div></div>)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [auth, setAuth] = useState<boolean>(false)
  useEffect(() => {
    const _isAuth = utils.isAuth()
    if (_isAuth) {
      setAuth(true)
    } else {
      setAuth(false)
    }
  })


  const [films, setFilms] = useState<IFilm[]>([])
  useEffect(() => {
    if (auth) {
      filmActions.getFilmsFromAuthUser().then((data) => {

        if (typeof data === 'string') {
          alert(data)
        } else {
          setFilms(data)
        }
      })
    } else if (films.length !== 0) {
      setFilms([])
    }
  })
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

  // const openUpdateFilmModal = () => {
  //   setModalComponent(<UpdateFilm />);  
  //   setOpen(true);
  // };
  
  const topBarActions = {
    login: openLoginModal,
    register: openRegisterModal,
    createFilm: openCreateFilmModal
  }

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <ThemeProvider theme={theme}>
      <SimpleModal open={open} onClose={handleClose} body={modalComponent}/>
      <div className='App'>
        <TopBar actions={topBarActions}/>
        <div className='FilmItemListWrapper'>
          <FilmItemList header='To see' filmList={films} />
          <FilmItemList header='Seen' filmList={[]} />
        </div>
      </div>
      <Typography className='credit'>Made by Ruben</Typography>
    </ThemeProvider>
  )
}

export default MyApp;