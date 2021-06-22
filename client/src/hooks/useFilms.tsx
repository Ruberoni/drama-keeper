import { useState, useEffect } from "react";
import { IFilm } from '../components/FilmItem/FilmItem'
import api from "../api";
import { useApp } from "../context"

/**
 * Hook for fetching authenticated user films
 */
export default function useFilms() : [{data: IFilm[], isLoading: boolean}, () => Promise<void>] {
  const app = useApp()
  const [data, setData] = useState<IFilm[]>([{}]);
  const [isLoading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    if (!app.state.authToken) setData([])
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
    } catch (err) {
      console.error(err)
      // Could add an error state so here I call
      // setError(true) or setError(err.message)
      // This way if hook had an error I could display it 
    } finally {

      setLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.state.authToken]);

  return [{ data, isLoading }, fetchData];
}