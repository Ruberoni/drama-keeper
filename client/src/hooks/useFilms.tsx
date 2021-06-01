import { useState, useEffect } from "react";
import { IFilm } from '../components/FilmItem/FilmItem'
import api from "../api";
import { useApp } from "../context"

/*
 * Hook for fetching authenticated user films
 * returns  [
 *            { 
 *              data: Array of Films, 
 *              isLoading: Boolean indicating if is fetching resources 
 *            }, 
 *            fetchData: function that fetch films and updates data
 *          ]
 * @todo
 * - Error state
 *
 */
export default function useFilms(/*token : string | null = ''*/) : [{data: IFilm[], isLoading: boolean}, () => Promise<void>] {
  const app = useApp()
  const [data, setData] = useState<IFilm[]>([{}]);
  const [isLoading, setLoading] = useState(false)

  const fetchData = async () => {
    if (!app.state.authToken) setData([])
    setLoading(true)
    const options = {
      headers: {
				'Authorization': `Bearer ${app.state.authToken/*token*/}`
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
  }, [app.state.authToken]);

  return [{ data, isLoading }, fetchData];
}