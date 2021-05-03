import imagemin from "imagemin";
import imageminPngquant from "imagemin-pngquant";
import imageminMozjpeg from "imagemin-mozjpeg";
import Debug from "debug";
import FileType from "file-type";

const debug = Debug("film");

/*
 * Determine file type from buffer
 * @params {Buffer} buffer The buffer to know file type
 * @returns {IFileTypeReturns} An object containing the information
 */
export const knowFileTypeFromBuffer = async (
  buffer: Buffer
): Promise<FileType.FileTypeResult | undefined> => {
  debug("UTIL: knowFileType | EXECUTED");
  try {
    const fileType = await FileType.fromBuffer(buffer);
    debug("UTIL: knowFileType | FINISHED GOOD");
    return fileType;
  } catch (err) {
    debug("UTIL: knowFileType | ERROR:", err.message);
    throw err;

  }
};

/*
 * Compress a png or jpeg buffer
 * @params {object} buffer The buffer image to compress
 * @returns {object} The buffer image compressed
 */
export const compressImage = async (
  buffer: Buffer
): Promise<Buffer | undefined> => {
  debug("UTIL: compressImage | EXECUTED");
  try {

    const compressedImage = await imagemin.buffer(buffer, {
      plugins: [
        imageminMozjpeg({
          quality: 10,
        }),
        imageminPngquant({
          quality: [0.1, 0.1],
        })
      ]
    });
    debug("UTIL: compressImage | FINISHED GOOD");
    return compressedImage;
  } catch (err) {
    debug("UTIL: compressImage | ERROR:", err.message);
  }
};