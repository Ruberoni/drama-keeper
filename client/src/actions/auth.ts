import API from '../api'
import { IFormValues } from '../components/Register/Register'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

/*
 * Post to API login URI. 
 * If OK then sets token cookie and return true
 * If ERROR returns err.message
 */
export const login = async (userData: IFormValues) : Promise<boolean | string> => {
  try {

    const options = {
      email: userData.email,
      password: userData.password 
    }

    // Do POST fetch
    const response = await API.post('/api/auth/login', options)

    // Set cookie with token
    cookies.set('token', response.data.token)
    return true
  } catch (err) {
    return err.message
  }
}

/*
 * Removes token cookie
 */
export const logout = () => {
  const cookies = new Cookies();
  cookies.remove('token')
  alert('Logged out')

}

/*
 * Post to API create user URI. 
 * If OK then return true
 * If ERROR returns err.message
 */
export const register = async (userData: IFormValues) : Promise<boolean | string>=> {
  try {
    const options = {
      email: userData.email,
      password: userData.password 
    }

    // Do POST fetch
    const response = await API.post('/api/users', options)

    return true
    
  } catch (err) {
    return err.message
  }

}