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
import { compressImage, knowFileTypeFromBuffer } from '../utils/compressImage'
import searchUtils from '../utils/search'

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
      data: Buffer,
      contentType: String
    }
  },
})

export interface IFilmLinks extends Document  {
  rottenTomatoes: string,
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
  type?: string,
  watched?: boolean,
  links: IFilmLinks
  images?: IFilmImages,
  addCover: any, // CHANGE type
  addCoverCompressed: any, // Change type,
  getAndSetLinks: any, // Change type,
  getAndSetLink: any, // Change type,
}

/*
 * Pre save hook, It performs three things 
 * 1. If a rotten tomatoes links has not been provided. It will set one
 * 2. Will set a images.cover
 * 3. Will fetch and save an image related to the film title
 */
// filmSchema.pre<IFilm>("save", async function (next) {
//   try {
//     if (!this.links.rottenTomatoes) {
//       this.links.rottenTomatoes = await searchUtils.getRottenTomatoesUrl(this.title)
//     }
//     if (!this.images.cover.data) {
//       this.images.cover = await searchUtils.getCover(this.title)
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

/*
 * Post save hook, It performs two things
 * 1. If a rotten tomatoes links has not been provided. It will set one
 * 2. TO DO: If a images.cover has not been provided. It will set one
 */
filmSchema.post<IFilm>("save", function (film) {
  if (!film.links.rottenTomatoes) {
    console.log('Executing post save hook for film:', film._id)
    film.getAndSetLink("Rotten Tomatoes").then(() => {console.log("AAAAAAAAAAAAAAA")})
    console.log('Finished post save hook for film:', film._id)

    // film.links.rottenTomatoes = await searchUtils.getRottenTomatoesUrl(film.title)
  }
});

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
  imageData: Buffer,
){
  const fileType = await knowFileTypeFromBuffer(imageData)
  await this.update({
    $set: {
      'images.cover.data': imageData,
      'images.cover.contentType': fileType?.mime
    }
  })
}

/*
 * Sets various links to the doc
 */
filmSchema.methods.getAndSetLinks = function (
  this: IFilm,
  pages: string[]
) {
  for (const page of pages) { 
    this.getAndSetLink(page)
  }
}

/*
 * Set a link to the doc
 */
filmSchema.methods.getAndSetLink = async function (
  this: IFilm,
  page: string
) {
  switch (page) {
    case "Rotten Tomatoes": {
      const url = await searchUtils.getRottenTomatoesUrl(this)
      this.links.rottenTomatoes = url || "#"
      // this.update({ })
      this.save()
      break;
  }
    default:
      
      break;
  }
  
}

/*
 * Adds an image compressed to the cover field
 */
filmSchema.methods.addCoverCompressed = async function (
  this: IFilm,
  imageData: Buffer,
){
  const imageDataCompressed = await compressImage(imageData)
  // const fileType = await knowFileTypeFromBuffer(imageData)
  // await this.update({
  //   $set: {
  //     'images.cover.data': imageDataCompressed,
  //     'images.cover.contentType': fileType?.mime
  //   }
  // })
  this.addCover(imageDataCompressed)
}

const Film = model<IFilm>("Film", filmSchema)
export default Film