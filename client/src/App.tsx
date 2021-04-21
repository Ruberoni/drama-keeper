import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
import './App.css';
import FilmItem from './components/FilmItem/FilmItem'
// import TopBar from './components/TopBar/TopBar'
// import Login from './components/Login/Login'

const theme = createMuiTheme({
  palette: {
    primary: red
  }
})

function MyApp() {
  return (
    <ThemeProvider theme={theme}>
      <FilmItem/>
    </ThemeProvider>
  )
}

export default MyApp;