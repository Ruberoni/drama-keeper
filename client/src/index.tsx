import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AppProvider } from './context'
import { pink, red } from '@mui/material/colors'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: red,
    // Material-UI v4's default secondary (MUI 5+ defaults to purple).
    secondary: { light: pink.A200, main: pink.A400, dark: pink.A700 },
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
