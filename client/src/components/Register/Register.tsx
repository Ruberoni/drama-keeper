import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik'
import * as yup from 'yup'
import AddIcon from '@material-ui/icons/Add';
import { UnderlinedHeading } from '../Text/Text'
import * as authActions from '../../actions/auth'

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

export interface IFormValues {
  email: string,
  password: string,
  passwordConfirmation?: string,
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email()
    .required('Email is required'),
  password: yup
    .string()
    .min(4)
    .required('password is required'),
  passwordConfirmation: yup.string()
  .test('passwords-match', 'Passwords must match', function(value){
    return this.parent.password === value
  }),

})


export function Forms ()  {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values: IFormValues) => {
      const registerOK = await authActions.register(values)
      alert("User registered.")
      if (registerOK ===! true) {
        alert("Error: " + registerOK)
        console.warn(registerOK)
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

         <TextField
           variant='outlined'
           size='small'
           name='passwordConfirmation'
           label='Confirm Password'
           type='password'
           value={formik.values.passwordConfirmation}
           onChange={formik.handleChange}
           error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
           helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
           className={classes.textField}
         />

         <Fab style={{width: 115}} color='primary' variant='extended' type="submit">
           <AddIcon /> Register
         </Fab>
         
       </form>
    </div>
  )
}

export default function Login() {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={0}>
      <p><UnderlinedHeading text="Register" /></p>
      <Forms />
    </Paper>
  );
}
