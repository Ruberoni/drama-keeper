import axios from "axios";
import Debug from "debug";
const debug = Debug("utils");

export default {
  /*
   * Gets https://www.rottentomatoes.com/m/${filmName}, if OK, return the url
   */
  getRottenTomatoesUrl: async (
    {title, type} : {title: string, type?: string }
  ): Promise<string> => {
    if (!title || !type) return '';
    let url;
    title = title.replaceAll(' ', '_').toLowerCase()
    try {
      if (type === 'Movie') {
        url = `https://www.rottentomatoes.com/m/${title}`;
        await axios.get(url);
        return url
      }

      if (type === 'TV') {
        url = `https://www.rottentomatoes.com/tv/${title}`;
        return await axios.get(url) && url
      }
      return ''
    } catch (err) {
      debug('getRottenTomatoesUrl error:', err.message)
      return ''
    }
  },

  getTMDbCover: async ({title, type} : {title: string, type?: string }) : Promise<string> => {
    let url;

    try {
      if (type === 'Movie') {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDb_API_KEY}&query=${title}`;
        const response = await axios.get(url);
        return response.data.results[0].poster_path || ''
      }

      if (type === 'TV') {
        url = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDb_API_KEY}&query=${title}`;
        const response = await axios.get(url);
        return response.data.results[0].poster_path || ''
      }

      return ''
    } catch (err) {
      debug('getTMDbCover error:', err)
      return ''
    }
  }
};
