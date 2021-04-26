import React from 'react'
import Fab from '@material-ui/core/Fab';
import { makeStyles, createStyles } from "@material-ui/core/styles";
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(() =>
  createStyles({
    focusVisibleClass: {
      border: '1px solid #616161', 
      borderRadius: 5
    }
  }))

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

  const classes = useStyles()

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

