import Cookies from 'universal-cookie'
import { IFilm } from '../components/FilmItem/FilmItem'
import { IFormValues } from '../components/CreateFilm/CreateFilm'

/*
 * Returns the string so img.src can read it and display the buffer image correctly
 */
export const correctImageBuffer = (buffer: Buffer) : string => 'data:image/jpeg;base64,' + buffer.toString('base64');

/*
 * Checks if the auth cookie is set
 */
export const isAuth = () : boolean => {
  const cookies = new Cookies();
  return Boolean((cookies.get('token')))
}

/*
 * Forms data is usually not in the correct way to be send to the API
 * this function fixes the value from the form in CreateFilm
 */
export const fixFilmData = (filmData: IFormValues ): IFilm => {
  const fixedFilmData : any = {}
  for (const prop in filmData) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const value = filmData[prop as keyof IFormValues]

    if (prop === 'rottenTomatoesLink') {
      if (value) {
        fixedFilmData['links'] = {rottenTomatoes: value}
      }
    }

    if (value || value === false) {
      fixedFilmData[prop] = value
    }
  }
  // console.log('util fixFilmData filmData:', filmData, 'fixedFilmData:', fixedFilmData)
  return fixedFilmData
}
