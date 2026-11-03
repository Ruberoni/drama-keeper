import Cookies from 'universal-cookie'
import { IFilm } from '../components/FilmItem/FilmItem'
import { IFormValues } from '../components/CreateFilm/CreateFilm'

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
  return fixedFilmData
}

/*
 * Gets a message out of anything thrown (catch clauses give `unknown`)
 */
export const errorMessage = (err: unknown) : string =>
  err instanceof Error ? err.message : String(err)
