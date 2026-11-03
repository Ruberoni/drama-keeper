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
import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import { IUser } from "./User"
import Debug from "debug";
import searchUtils from '../utils/search'

const debug = Debug("models:film");

const filmSchema = new Schema<IFilm>({
  user: Schema.Types.ObjectId,
  title: {
    type: String, 
    required: true
  },
  type: {
    type: String,
    enum: ['Movie', 'TV', '']
  },
  watched: {
    type: Boolean,
  },
  links: {
    rottenTomatoes: { 
      type: String, 
      validate: {
        validator: (val: string): boolean => (isURL(val) || val === '#' || val === ''),
        message: "{VALUE} is not an URL"
      },
      default: ''

    },
    imdb: { 
      type: String, 
      validate: {
        validator: (val: string) : boolean => isURL(val),
        message: "{VALUE} is not an URL"
      }
    }
  },
  images: {
    cover: {
      type: String,
      default: ''
    }
  },
})

export interface IFilmLinks extends Document  {
  rottenTomatoes: string,
  imdb?: string
}

export interface IFilmImages extends Document {
  cover?: string
}

export interface IFilm extends Document {
  user: IUser['_id'],
  title: string,
  type?: string,
  watched?: boolean,
  links: IFilmLinks
  images: IFilmImages,
  getAndSetLinks: any, // Change type,
  getAndSetLink: any, // Change type,
  getAndSetCover: any, // Change type,
}



/*
 * Post save hook, It performs two things
 * 1. If a rotten tomatoes links has not been provided. It will set one
 * 2. TO DO: If a images.cover has not been provided. It will set one
 */
filmSchema.post<IFilm>("save", function (film) {
  if (!film.links.rottenTomatoes) {
    film.getAndSetLink("Rotten Tomatoes").catch(debug)

  }

  if (!film.images.cover) {

   film.getAndSetCover().catch(debug)
  }
});

/*
 * Sets various links to the doc
 */
filmSchema.methods.getAndSetLinks = async function (
  this: IFilm,
  pages: string[]
) {
  for (const page of pages) { 
    await this.getAndSetLink(page)
  }
}

/*
 * Set a cover url to the doc
 */
 
filmSchema.methods.getAndSetCover = async function (
  this: IFilm,
) {
  const cover = await searchUtils.getTMDbCover(this)
  this.images.cover = cover || '#'
  await this.save()
}


/*
 * Set a link to the doc
 */
filmSchema.methods.getAndSetLink = async function (
  this: IFilm,
  page: string
) {
  switch (page) {
    case "Rotten Tomatoes": 
      const url = await searchUtils.getRottenTomatoesUrl(this)
      this.links.rottenTomatoes = url || "#"
      
      await this.save()
      break;
    
    default: 
      this.links.rottenTomatoes = "#"
      await this.save()
    
  }
}

const Film = model<IFilm>("Film", filmSchema)
export default Film