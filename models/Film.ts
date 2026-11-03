/**
# Film

- User - ObjectId
- Title - String - Required
- Watched - Boolean - Default to false
- Links - Map of Strings
- Cover - Buffer ([How to](https://gist.github.com/aheckmann/2408370))

### Pre-hooks

- For **Save:**
    - If Links is not provided: Search for a link of the film Rotten Tomatoes with the Title provided and save in Links as {RottenTomatoes: "<Link>"}
    - Search for a film cover and save it
*/

/**

  Thanks to  @tomanagle and its Mongoose TypeScript example repository.
  https://github.com/tomanagle/Mongoose-TypeScript-example

  Thanks to @aheckmann and its gist.
  https://gist.github.com/aheckmann/2408370

*/
import { Schema, model, Model, HydratedDocument, Types } from "mongoose";
import isURL from "validator/lib/isURL";
import Debug from "debug";
import searchUtils from "../utils/search";

const debug = Debug("models:film");

export interface IFilmLinks {
  rottenTomatoes: string;
  imdb?: string;
}

export interface IFilmImages {
  cover?: string;
}

export interface IFilm {
  user?: Types.ObjectId;
  title: string;
  type?: string;
  watched?: boolean;
  links: IFilmLinks;
  images: IFilmImages;
}

export interface IFilmMethods {
  getAndSetLinks(pages: string[]): Promise<void>;
  getAndSetLink(page: string): Promise<void>;
  getAndSetCover(): Promise<void>;
}

export type FilmModel = Model<IFilm, Record<string, never>, IFilmMethods>;
export type FilmDocument = HydratedDocument<IFilm, IFilmMethods>;

const filmSchema = new Schema<IFilm, FilmModel, IFilmMethods>({
  user: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Movie", "TV", ""],
  },
  watched: {
    type: Boolean,
  },
  links: {
    rottenTomatoes: {
      type: String,
      validate: {
        validator: (val: string): boolean =>
          isURL(val) || val === "#" || val === "",
        message: "{VALUE} is not an URL",
      },
      default: "",
    },
    imdb: {
      type: String,
      validate: {
        validator: (val: string): boolean => isURL(val),
        message: "{VALUE} is not an URL",
      },
    },
  },
  images: {
    cover: {
      type: String,
      default: "",
    },
  },
});

/*
 * Post save hook, It performs two things
 * 1. If a rotten tomatoes links has not been provided. It will set one
 * 2. If a images.cover has not been provided. It will set one
 */
filmSchema.post("save", function (film) {
  const needsLink = !film.links.rottenTomatoes;
  const needsCover = !film.images.cover;
  if (!needsLink && !needsCover) return;

  // Fetch both, then save once: two separate saves would run in parallel on
  // the same doc and one would fail with ParallelSaveError.
  (async () => {
    const [url, cover] = await Promise.all([
      needsLink ? searchUtils.getRottenTomatoesUrl(film) : "",
      needsCover ? searchUtils.getTMDbCover(film) : "",
    ]);
    if (needsLink) film.links.rottenTomatoes = url || "#";
    if (needsCover) film.images.cover = cover || "#";
    await film.save();
  })().catch(debug);
});

/*
 * Sets various links to the doc
 */
filmSchema.methods.getAndSetLinks = async function (pages: string[]) {
  for (const page of pages) {
    await this.getAndSetLink(page);
  }
};

/*
 * Set a cover url to the doc
 */

filmSchema.methods.getAndSetCover = async function () {
  const cover = await searchUtils.getTMDbCover(this);
  this.images.cover = cover || "#";
  await this.save();
};

/*
 * Set a link to the doc
 */
filmSchema.methods.getAndSetLink = async function (page: string) {
  switch (page) {
    case "Rotten Tomatoes": {
      const url = await searchUtils.getRottenTomatoesUrl(this);
      this.links.rottenTomatoes = url || "#";

      await this.save();
      break;
    }

    default:
      this.links.rottenTomatoes = "#";
      await this.save();
  }
};

const Film = model<IFilm, FilmModel>("Film", filmSchema);
export default Film;
