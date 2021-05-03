import Cookies from 'universal-cookie'

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