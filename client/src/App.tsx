import React, { useEffect} from 'react';
import './App.css';
import TopBar from './components/TopBar/TopBar'
import FilmItemList from './components/FilmItemList/FilmItemList'
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from 'universal-cookie';
import { useInterval } from './hooks/useInterval'
import useFilms from './hooks/useFilms'
import { useApp } from "./context"
import TMDbLogo from './assets/img/tmdbattribution.svg'

const cookies = new Cookies();

function MyApp() {

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.state?.reloadFilms])
  
  return (
    <>
        <div className='App'>
          <TopBar/>
          { films.isLoading && (<div className='loadingIndicator'><CircularProgress /></div>) }
          {/*<div className='loadingIndicator'><CircularProgress /></div>*/}
          <div className='FilmItemListWrapper'>
            <FilmItemList header='To see' filmList={films.data.filter(film => film.watched === false)}/>
            <FilmItemList header='Seen' filmList={films.data.filter(film => film.watched === true)} />
          </div>
        </div>
        <div className='credit'>
          <a href="https://www.themoviedb.org/" target='_blank' rel='noreferrer'><img src={TMDbLogo} alt="tmdblogo" className='tmdblogo'/></a>
          <Typography >Made by&nbsp;
            <a href="https://github.com/Ruberoni" target='_blank' rel='noreferrer' className='author'>
             Ruben
            </a>
          </Typography>
          <Typography className='tmdbattribution' variant='caption'>This product uses the TMDb API but is not endorsed or certified by TMDb</Typography>
        </div>
    </>
  )
}

export default MyApp;