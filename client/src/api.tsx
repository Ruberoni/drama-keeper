import axios from 'axios'

export default axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {'server-authorization': 'Bearer ' + import.meta.env.VITE_SERVER_AUTH_TOKEN }
})