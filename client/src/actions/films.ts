import { instance } from './index'
import Cookies from 'universal-cookie';
import { IFilm } from '../components/FilmItem/FilmItem'

const cookies = new Cookies();

// eslint-disable-next-line @typescript-eslint/ban-types
export const getFilmsFromAuthUser = async () : Promise<string | IFilm[]>=> {
  try {
    const token = cookies.get('token')

    const options = {
      headers: {'Authorization': `Bearer ${token}`}
    }

    const response = await instance.get('/api/films/test/getfilmsauthorized', options)

    return response.data.films
  } catch (err) {
    return err.message
  }
}