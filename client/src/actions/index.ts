import axios from 'axios'
// import ip from 'ip'

export const instance = axios.create({
  baseURL: `http://192.168.1.13:4000`
})