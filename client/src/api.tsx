import axios from 'axios'

// const baseURL = process.env.NODE_ENV === 'development' ? 'http://192.168.1.13:4000' : process.env.REACT_APP_API_URL;

export default axios.create({
    baseURL: process.env.REACT_APP_API_URL
})