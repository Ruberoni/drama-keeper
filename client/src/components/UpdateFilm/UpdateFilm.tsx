import React from "react";
import { makeStyles } from 'tss-react/mui';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { useFormik } from 'formik'
import AddIcon from '@mui/icons-material/Add';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { UnderlinedHeading } from '../Text/Text'
import { IFormValues, validationSchema } from '../CreateFilm/CreateFilm'
import * as filmActions from '../../actions/films'
import { useApp } from '../../context/index'


const useStyles = makeStyles()(() =>
  ({
    root: {
      width: "90%",
      maxWidth: 300,
      padding: '1px 0px  17px',
      backgroundColor: "white",
      borderRadius: 23,
      margin: 'auto'
    },
    form: {
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center'
    },
    textField: {
      margin: '6px 0px'
    }
  }));

export interface IUpdateFilm {
  _id: string
}

export function Forms ({_id}: IUpdateFilm)  {
  const app = useApp()

  const formik = useFormik({
    initialValues: {
      title: '',
      type: '',
      rottenTomatoesLink: '',
      watched: false
    },
    validationSchema: validationSchema,
    onSubmit: async (values: IFormValues) => {
      const response = await filmActions.updateFilm(values, _id)
        if (typeof response === 'string') {
          console.warn(response)
       } else {
         app.reloadFilms('UPDATE')

       }
    }
  })


  const { classes } = useStyles()

  return (
    <div>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <TextField
          variant='outlined'
          size='small'
          name='title'
          label='Title'
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
           className={classes.textField}

        />

        <FormLabel error={formik.touched.type && Boolean(formik.errors.type)}>
         {formik.touched.type && formik.errors.type}
       </FormLabel>
       <RadioGroup aria-label="type" row name="type" id="type" value={formik.values.type} onChange={formik.handleChange}>
         <FormControlLabel value="TV" control={<Radio />} label="TV" />
         <FormControlLabel value="Movie" control={<Radio />} label="Movie" />
       </RadioGroup>
        
        <TextField
          variant='outlined'
          size='small'
          name='rottenTomatoesLink'
          label='Rotten Tomatoes'
          value={formik.values.rottenTomatoesLink}
          onChange={formik.handleChange}
          error={formik.touched.rottenTomatoesLink && Boolean(formik.errors.rottenTomatoesLink)}
          helperText={formik.touched.rottenTomatoesLink && formik.errors.rottenTomatoesLink}
          className={classes.textField}
        />
        <div>
          <Checkbox
           id='watched'
           value={formik.values.watched}
           onChange={formik.handleChange}
           slotProps={{
             input: { name: 'watched', 'aria-label': 'primary checkbox' }
           }}
         />
         <Typography style={{display: 'inline'}} variant='body2'>Already seen?</Typography>
       </div>
        <Fab style={{width: 115}} color='primary' variant='extended' type="submit">
          <AddIcon /> Update
        </Fab>
        
      </form>
    </div>
  );
}

export default function Update({_id}: IUpdateFilm) {
  const { classes } = useStyles();
  return (
    <Paper className={classes.root} elevation={0}>
      <p><UnderlinedHeading text="Update a Film" /></p>
      <Forms _id={_id}/>
    </Paper>
  );
}
