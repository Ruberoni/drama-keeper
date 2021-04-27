import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
import './App.css';
// import FilmItem from './components/FilmItem/FilmItem'
// import TopBar from './components/TopBar/TopBar'
// import CreateFilm from './components/CreateFilm/CreateFilm'
// import Login from './components/Login/Login'
// import UpdateFilm from './components/UpdateFilm/UpdateFilm'
// import Register from './components/Register/Register'
import FilmItemList from './components/FilmItemList/FilmItemList'
// import { IFilm } from './components/FilmItem/FilmItem'

const theme = createMuiTheme({
  palette: {
    primary: red
  }
})

function MyApp() {

  // Fetch films by user
  // Response template: Film[]
  // where Film = {User: , Title: , Watched: , Links: , Cover: } 

  return (
    <ThemeProvider theme={theme}>
      <div className='FilmItemListWrapper'>
        <FilmItemList filmList={[{title: 'hola'}, {title: 'como'}, {title: 'estas'}, {title: 'ddd'}, {title: 'eee'}, {title: 'fff'}]} />
        <FilmItemList filmList={[{title: 'aaa'}, {title: 'bbb'}, {title: 'ccc'}]} />
      </div>
 
    </ThemeProvider>
  )
}

export default MyApp;