import React, {useState} from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik'
import * as yup from 'yup'
import Checkbox from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { UnderlinedHeading } from '../Text/Text'
import { TogglerAdvancedSettings } from '../Button/Button'
import * as filmActions from '../../actions/films'
import { useApp } from '../../context/index'


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
  })
);

const useFormStyles = makeStyles(() =>
  createStyles({
    form: {
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center'
  },
    advancedSettings: {
      marginTop: 15
    },
  })
)

export interface IFormValues {
  title?: string,
  type?: string, 
  rottenTomatoesLink?: string,
  watched?: boolean
}

export const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required'),
  type: yup
    .string()
    .required('Type is required'),
  rottenTomatoesLink: yup
    .string(),
  watched: yup
    .boolean()
})

export function Forms ()  {
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
      const response = await filmActions.createFilmAuthUser(values)
      if (typeof response === 'string') {
        console.warn(response)
       } else {
         app.reloadFilms('CREATE')
       }
    }
  })

  const [advanced, setAdvance] = useState(false)

  const handleAdvanceSettingsToggler = () => setAdvance(!advanced)

  const classes = useFormStyles()

  return (
    <div>
       <form className={classes.form} onSubmit={formik.handleSubmit}>
         <TextField
           variant='outlined'
           size='small'
           id='title'
           name='title'
           label='Title'
           value={formik.values.title}
           onChange={formik.handleChange}
           error={formik.touched.title && Boolean(formik.errors.title)}
           helperText={formik.touched.title && formik.errors.title}
        />
        <FormLabel error={formik.touched.type && Boolean(formik.errors.type)}>
          {formik.touched.type && formik.errors.type}
        </FormLabel>
        <RadioGroup aria-label="type" row name="type" id="type" value={formik.values.type} onChange={formik.handleChange}>
          <FormControlLabel value="TV" control={<Radio />} label="TV" />
          <FormControlLabel value="Movie" control={<Radio />} label="Movie" />
        </RadioGroup>
         
         {advanced && 
          <div className={classes.advancedSettings}>
             <TextField
               variant='outlined'
               size='small'
               id='rottenTomatoesLink'
               name='rottenTomatoesLink'
               label='Rotten Tomatoes'
               value={formik.values.rottenTomatoesLink}
               onChange={formik.handleChange}
               error={formik.touched.rottenTomatoesLink && Boolean(formik.errors.rottenTomatoesLink)}
               helperText={formik.touched.rottenTomatoesLink && formik.errors.rottenTomatoesLink}
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
          </div>
          }
          <TogglerAdvancedSettings open={advanced} handleToggler={handleAdvanceSettingsToggler}/>

         <Fab style={{width: 115}} color='primary' variant='extended' type="submit">
           <AddIcon /> Create
         </Fab>
         
       </form>
    </div>
  )
}

export default function CreateFilm() {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={0}>
      <p><UnderlinedHeading text="Add a Film" /></p>
      <Forms />
    </Paper>
  );
}

