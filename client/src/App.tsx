import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
import './App.css';
// import FilmItem from './components/FilmItem/FilmItem'
// import TopBar from './components/TopBar/TopBar'
// import CreateFilm from './components/CreateFilm/CreateFilm'
// import Login from './components/Login/Login'
import UpdateFilm from './components/UpdateFilm/UpdateFilm'

const theme = createMuiTheme({
  palette: {
    primary: red
  }
})

function MyApp() {
  return (
    <ThemeProvider theme={theme}>
      <UpdateFilm />
    </ThemeProvider>
  )
}

export default MyApp;