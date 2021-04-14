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
import { compressImagePng } from '../utils/compressImage'

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
  contentType: ImagesContentTypes
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
  addCover: any, // CHANGE type
  addCoverCompressed: any // Change type
}

enum ImagesContentTypes {
  png ='image/png',
  jpeg = 'image/jpeg'
}

/*
 * Adds an image to the cover field
 * https://gist.github.com/aheckmann/2408370
 */
filmSchema.methods.addCover = async function (
  this: IFilm,
  imageData: Record<string, unknown>,
  imageType: keyof typeof ImagesContentTypes
){
  await this.update({
    $set: {
      'images.cover.data': imageData,
      'images.cover.contentType': ImagesContentTypes[imageType]
    }
  })
}

/*
 * Adds an image compressed to the cover field
 */
filmSchema.methods.addCoverCompressed = async function (
  this: IFilm,
  imageData: Buffer,
  imageType: keyof typeof ImagesContentTypes
){
  const imageDataCompressed = await compressImagePng(imageData)
  await this.update({
    $set: {
      'images.cover.data': imageDataCompressed,
      'images.cover.contentType': ImagesContentTypes[imageType]
    }
  })
}

const Film = model<IFilm>("Film", filmSchema)
export default Film