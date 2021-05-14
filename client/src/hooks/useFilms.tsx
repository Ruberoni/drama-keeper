import { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import { IFilm } from '../components/FilmItem/FilmItem'
import api from "../api";

const cookies = new Cookies();

/*
 * Hook for fetching authenticated user films
 * returns  [
 *            { 
 *              data: Array of Films, 
 *              isLoading: Boolean indicating if is fetching resources 
 *            }, 
 *            fetchData: function that fetch films and updates data
 *          ]
 *
 */
export default function useFilms() : [{data: IFilm[], isLoading: boolean}, () => Promise<void>] {
  const [data, setData] = useState<IFilm[]>([{}]);
  const [isLoading, setLoading] = useState(false)
  
  const token = cookies.get('token')

  const fetchData = async () => {
    setLoading(true)
    const options = {
      headers: {
				'Authorization': `Bearer ${token}`
      }
    }
    try {
      // Request API
      const response = await api.get('/api/films/test/getfilmsauthorized', options);
      // Set Data
      setData(response.data.films);
      setLoading(false)
    } catch (err) {
      console.error(err)
      // Could add an error state so here I call
      // setError(true) or setError(err.message)
      // This way if hook had an error I could display it 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return [{ data, isLoading }, fetchData];
}