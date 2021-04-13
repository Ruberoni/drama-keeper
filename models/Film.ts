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
**/

/*

  Thanks to  @tomanagle and its Mongoose TypeScript example repository.
  https://github.com/tomanagle/Mongoose-TypeScript-example

  Thanks to @aheckmann and its gist.
  https://gist.github.com/aheckmann/2408370

*/

import { Schema, model, Document } from "mongoose";
import isURL from "validator/lib/isURL";
import { IUser } from "./User"

const filmSchema = new Schema<IFilm>({
  user: Schema.Types.ObjectId,
  title: {
    type: String, 
    required: true
  },
  watched: {
    type: Boolean
  },
  links: {
    rottenTomatoes: { 
      type: String, 
      validate: {
        validator: (val: string) : boolean => isURL(val),
        message: "{VALUE} is not an URL"
      }
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
      data: Buffer,
      contentType: String
    }
  },
})

export interface IFilmLinks extends Document  {
  rottenTomatoes?: string,
  imdb?: string
}

export interface IImage extends Document  {
  data: Record<string, unknown>,
  contentType: string
}

export interface IFilmImages extends Document {
  cover?: IImage
}

export interface IFilm extends Document {
  user: IUser['_id'],
  title: string,
  watched?: boolean,
  links?: IFilmLinks
  images?: IFilmImages,
  addCoverPNG: any // CHANGE THIS
}

/*
 * Adds an image (PNG only) to the cover field
 * https://gist.github.com/aheckmann/2408370
 */
filmSchema.methods.addCoverPNG = async function (
  this: IFilm,
  imageData: Record<string, unknown>
) {
  await this.update({
    $set: {
      'images.cover.data': imageData,
      'images.cover.contentType': 'image/png'
    }
  })
} 

const Film = model<IFilm>("Film", filmSchema)
export default Film