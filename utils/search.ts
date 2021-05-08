import axios from "axios";
import Debug from "debug";
const debug = Debug("utils");

export default {
  /*
   * Gets https://www.rottentomatoes.com/m/${filmName}, if OK, return the url
   */
  getRottenTomatoesUrl: async (
    filmName: string | undefined
  ): Promise<string> => {
    if (!filmName) return '';
    let response;
    let url;

    filmName = filmName.replaceAll(' ', '_').toLowerCase()

    try {
      url = `https://www.rottentomatoes.com/m/${filmName}`;
      response = await axios.get(url);
      if (response.statusText == "OK") return url;
    } catch (err) {
      debug(err);
    }
    try {
      url = `https://www.rottentomatoes.com/tv/${filmName}`;
      response = await axios.get(url);
      if (response.statusText == "OK") return url;
    } catch (err) {
      debug(err);
    }

    return "";
  },
};
