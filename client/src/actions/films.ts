import API from '../api'
import Cookies from 'universal-cookie';
import { IFilm } from '../components/FilmItem/FilmItem'
import { IFormValues } from '../components/CreateFilm/CreateFilm'
import * as utils from '../utils/index'

const cookies = new Cookies();

// eslint-disable-next-line @typescript-eslint/ban-types
export const getFilmsFromAuthUser = async () : Promise<string | IFilm[]>=> {
  try {
    const token = cookies.get('token')

    const options = {
      headers: {'Authorization': `Bearer ${token}`}
    }

    const response = await API.get('/api/films/test/getfilmsauthorized', options)

    return response.data.films
  } catch (err) {
    return err.message
  }
}

/*
 * Request API Create a film with Auth header
 * @return true if everything went OK, if an error ocurred a string with err.message is returned
 */
export const createFilmAuthUser = async (filmData: IFormValues) : Promise<string | boolean> => {
  try {

    const token = cookies.get('token')

    await API.post('/api/films/test/createfilmauthorized',
      utils.fixFilmData(filmData),
    {
      headers: {'Authorization': `Bearer ${token}`}
    })
    return true

  } catch (err) {
    return err.message
  }
}

/*
 * Request API to delete a film
 * @params {string} id Film id
 */
export const deleteFilm = async (id: string | undefined) => {
  try {

    const response = await API.delete(`/api/films/${id}`)
    if (response.statusText !== 'OK') {
      return response.data
    } 

  } catch (err) {
    return err.response.data
  }
} 

/*
 * Request API to update film
 * @params {object} filmData 
 * @params {string} id Film id
 */
 export const updateFilm = async (filmData: IFormValues, id: string | undefined) => {
  try {

    const response = await API.put(`/api/films/${id}`, utils.fixFilmData(filmData))
    if (response.statusText !== 'OK') {
      return response.data
    } 

  } catch (err) {
    return err.response.data
  }
} 
