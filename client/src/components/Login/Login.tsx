import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik'
import * as yup from 'yup'
import AddIcon from '@material-ui/icons/Add';
import { UnderlinedHeading } from '../Text/Text'
import { IFormValues } from '../Register/Register'
import { useApp } from '../../context'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "90%",
      maxWidth: 300,
      padding: '1px 0px  17px',
      backgroundColor: "white",
      borderRadius: 20,
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

const validationSchema = yup.object({
  email: yup
    .string()
    .email()
    .required('Email is required'),
  password: yup
    .string()
    .min(4)
    .required('password is required'),

})


export function Forms ()  {

  const app = useApp()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values: IFormValues) => {
      const loginOK = app.auth.login(values)
      if (loginOK ==! true) {
        console.warn(loginOK)
      }
    }
  })


  const classes = useStyles()

  return (
    <div>
       <form className={classes.form} onSubmit={formik.handleSubmit}>
         <TextField
           variant='outlined'
           size='small'
           name='email'
           label='Email'
           type='email'
           value={formik.values.email}
           onChange={formik.handleChange}
           error={formik.touched.email && Boolean(formik.errors.email)}
           helperText={formik.touched.email && formik.errors.email}
          className={classes.textField}

         />
         
         <TextField
           variant='outlined'
           size='small'
           name='password'
           label='Password'
           type='password'
           value={formik.values.password}
           onChange={formik.handleChange}
           error={formik.touched.password && Boolean(formik.errors.password)}
           helperText={formik.touched.password && formik.errors.password}
           className={classes.textField}
         />

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
      <p><UnderlinedHeading text="Login" /></p>
      <Forms />
    </Paper>
  );
}
