import React from 'react'
import Fab from '@mui/material/Fab';
import { makeStyles } from 'tss-react/mui';
import ButtonBase from '@mui/material/ButtonBase';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const useStyles = makeStyles()(() =>
  ({
    focusVisibleClass: {
      border: '1px solid #616161', 
      borderRadius: 5
    }
  }));

export function NotImplementedButton() {
 return (
   <Fab style={{width: 115}} color='primary' variant='extended' type="submit">
     Login
   </Fab>
)}

export interface IToggler {
  open: any,
  handleToggler: any,
  style?: any
}

export function TogglerAdvancedSettings({ open, handleToggler, style } : IToggler){

  const { classes } = useStyles()

  return (
  <ButtonBase 
    style={style || {color: "#616161"}} 
    onClick={handleToggler} 
    focusVisibleClassName={classes.focusVisibleClass}>
     {open ? 
       <>Hide advanced settings<ExpandLessIcon /></>
       : 
       <>Advanced settings<ExpandMoreIcon /></>
      }
 </ButtonBase>
  )
}

