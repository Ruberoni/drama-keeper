import { useState, useEffect, useRef } from "react";
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

  // The token of the latest commit. fetchData checks it so that a request started before
  // logout (or a token change) can't write stale films back into the list when it settles.
  const currentToken = useRef(authToken)
  useEffect(() => {
    currentToken.current = authToken
  }, [authToken])

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
    const token = authToken
    if (currentToken.current !== token) return
    setLoading(true)
    if (!token) setData([])
    try {
      const films = await getFilms(token)
      if (currentToken.current === token) setData(films)
    } catch (err) {
      console.error(err)
    } finally {
      if (currentToken.current === token) setLoading(false)
    }
  };

  return [{ data, isLoading }, fetchData];
}
