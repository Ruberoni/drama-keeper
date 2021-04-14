import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import Debug from 'debug'

const debug = Debug('film')

/*
 * Compress an PNG image buffer
 * @params {object} imageBuffer The buffer image to compress 
 * @returns {object} The buffer image compressed
 */
export const compressImagePng = async (
  imageBuffer : Buffer
  ) : Promise<Buffer | undefined> => {

  debug("UTIL: compressImagePng | EXECUTED");
  try {
    const compressedImage = await imagemin.buffer(
      imageBuffer, {
        plugins: [
          imageminPngquant({
            speed: 1,
            strip: true,
            quality: [0.1,0.1]
          })
        ]
      })
    debug("UTIL: compressImagePng | FINISHED GOOD");
    return compressedImage
  } catch (err) {

    debug("UTIL: compressImagePng | ERROR:", err.message);

  } 
}