import { useState, useEffect } from "react";
import { IFilm } from '../components/FilmItem/FilmItem'
import api from "../api";
import { useApp } from "../context"

async function getFilms(authToken: string | null): Promise<IFilm[]> {
  const options = {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  }
  const response = await api.get('/api/films/test/getfilmsauthorized', options);
  return response.data.films
}

/**
 * Hook for fetching authenticated user films
 */
export default function useFilms() : [{data: IFilm[], isLoading: boolean}, () => Promise<void>] {
  const app = useApp()
  const authToken: string | null = app.state.authToken
  const [data, setData] = useState<IFilm[]>([{}]);
  // Starts true: the effect below fetches on mount.
  const [isLoading, setLoading] = useState(true)

  // When the token changes, reset during render rather than in the effect, so the effect only
  // sets state once the request settles (react.dev: "Adjusting some state when a prop changes").
  const [prevAuthToken, setPrevAuthToken] = useState(authToken)
  if (authToken !== prevAuthToken) {
    setPrevAuthToken(authToken)
    setLoading(true)
    if (!authToken) setData([])
  }

  useEffect(() => {
    let ignore = false
    getFilms(authToken)
      .then((films) => { if (!ignore) setData(films) })
      .catch((err) => console.error(err))
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [authToken]);

  // Called by the poll interval and after film changes.
  const fetchData = async () => {
    setLoading(true)
    if (!authToken) setData([])
    try {
      setData(await getFilms(authToken));
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  };

  return [{ data, isLoading }, fetchData];
}
