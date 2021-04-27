import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { useFormik } from 'formik'
import AddIcon from '@material-ui/icons/Add';
import { UnderlinedHeading } from '../Text/Text'
import { IFormValues, validationSchema } from '../CreateFilm/CreateFilm'

const useStyles = makeStyles(() =>
  createStyles({
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
  })
);

export function Forms ()  {
  const formik = useFormik({
    initialValues: {
      title: '',
      rottenTomatoesLink: '',
      watched: false
    },
    validationSchema: validationSchema,
    onSubmit: (values: IFormValues) => {
      alert(JSON.stringify(values, null, 2))
    }
  })


  const classes = useStyles()

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
            inputProps={{ name: 'watched', 'aria-label': 'primary checkbox' }}
            id='watched'
            value={formik.values.watched}
            onChange={formik.handleChange}
          />
          <Typography style={{display: 'inline'}} variant='body2'>Already seen?</Typography>
        </div>
         <Fab style={{width: 115}} color='primary' variant='extended' type="submit">
           <AddIcon /> Login
         </Fab>
         
       </form>
    </div>
  )
}

export default function Login() {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={0}>
      <p><UnderlinedHeading text="Update a Film" /></p>
      <Forms />
    </Paper>
  );
}
