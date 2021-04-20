import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
import './App.css';
import TopBar from './components/TopBar/TopBar'

const theme = createMuiTheme({
  palette: {
    primary: red
  }
})

function MyApp() {
  return (
    <ThemeProvider theme={theme}>
      <TopBar/>
    </ThemeProvider>
  )
}


export default MyApp;
