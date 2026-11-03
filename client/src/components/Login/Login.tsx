import React from "react";
import { makeStyles } from 'tss-react/mui';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { useFormik } from 'formik'
import * as yup from 'yup'
import AddIcon from '@mui/icons-material/Add';
import GoogleSignIn from '../GoogleSignIn/GoogleSignIn'
import { UnderlinedHeading } from '../Text/Text'
import { IFormValues } from '../Register/Register'
import { useApp } from '../../context'


const useStyles = makeStyles()(() =>
  ({
    root: {
      width: "90%",
      maxWidth: 300,
      padding: '1px 0px  17px',
      backgroundColor: "white",
      borderRadius: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
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
      if (loginOK ===! true) {
        console.warn(loginOK)
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
  const { classes } = useStyles();
  const app = useApp();

  const handleLogin = async (credential: string) => {
    const loginOK = await app.auth.googleLogin(credential);
    if (loginOK === !true) {
      console.warn(loginOK);
    }
  };

  // maxWidth={false}: Container's responsive max-width would otherwise beat classes.root (300px).
  return (
    <Container maxWidth={false} className={classes.root}>
      <p>
        <UnderlinedHeading text="Login" />
      </p>
      <GoogleSignIn onCredential={handleLogin} />
      <p style={{ fontWeight: 600 }}>or</p>
      <Forms />
    </Container>
  );
}
