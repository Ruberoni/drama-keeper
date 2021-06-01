import React, { useState, useEffect} from 'react';
import './App.css';
import TopBar from './components/TopBar/TopBar'
import CreateFilm from './components/CreateFilm/CreateFilm'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import UpdateFilm from './components/UpdateFilm/UpdateFilm'
import FilmItemList from './components/FilmItemList/FilmItemList'
import Typography from "@material-ui/core/Typography";
import Modal from '@material-ui/core/Modal';
import Cookies from 'universal-cookie';
import { useInterval } from './hooks/useInterval'
import useFilms from './hooks/useFilms'
import { useApp } from "./context"
import TMDbLogo from './assets/img/tmdbattribution.svg'

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

function MyApp() {

  const [open, setOpen] = useState<boolean>(false);
  // eslint-disable-next-line no-undef
  const [modalComponent, setModalComponent] = useState<JSX.Element>(<div></div>)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const app = useApp()

  useEffect(() => {
    const token = cookies.get('token')
    if (!token && app.state.authToken) {
      app.dispatch({type: 'LOGOUT'})

    }
    if (token && !app.state.authToken) {
      app.dispatch({type: 'LOGIN', token: token}) // Calling this reloads the app so the useEffect is again called
    }
  })

  const [films, reloadFilms] = useFilms()

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

  }, [app.state?.reloadFilms])

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

  return (
    <>
        <SimpleModal open={open} onClose={handleClose} body={modalComponent}/>
        <div className='App'>
          <TopBar actions={topBarActions}/>
          <div className='FilmItemListWrapper'>
            <FilmItemList header='To see' filmList={films.data.filter(film => film.watched === false)/*[{_id: 'asda'}]*/} />
            <FilmItemList header='Seen' filmList={films.data.filter(film => film.watched === true)} />
          </div>
        </div>
        <div className='credit'>
          <a href="https://www.themoviedb.org/" target='_blank' rel='noreferrer'><img src={TMDbLogo} className='tmdblogo'/></a>
          <Typography >Made by Ruben</Typography>
          <Typography className='tmdbattribution' variant='caption'>This product uses the TMDb API but is not endorsed or certified by TMDb</Typography>
        </div>
    </>
  )
}

export default MyApp;