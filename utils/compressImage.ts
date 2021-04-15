import imagemin from "imagemin";
import imageminPngquant from "imagemin-pngquant";
import imageminMozjpeg from "imagemin-mozjpeg";
import Debug from "debug";
import FileType from "file-type";

const debug = Debug("film");

/*
 * Compress an PNG image buffer
 * @params {object} imageBuffer The buffer image to compress
 * @returns {object} The buffer image compressed
 */
export const compressImagePng = async (
  imageBuffer: Buffer
): Promise<Buffer | undefined> => {
  debug("UTIL: compressImagePng | EXECUTED");
  try {
    const compressedImage = await imagemin.buffer(imageBuffer, {
      plugins: [
        imageminPngquant({
          speed: 1,
          strip: true,
          quality: [0.1, 0.1],
        }),
      ],
    });
    debug("UTIL: compressImagePng | FINISHED GOOD");
    return compressedImage;
  } catch (err) {
    debug("UTIL: compressImagePng | ERROR:", err.message);
    throw err;

  }
};

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
 * Gets the corresponding Imagemin Plugin from the filetype provided
 */
const getImageminPlugin = (
  fileType: FileType.FileExtension
): imagemin.Plugin => {
  switch (fileType) {
    case "png":
      return imageminPngquant({
        quality: [0.1, 0.1],
      });
      break;
    case "jpg":
      return imageminMozjpeg({
        quality: 10,
      });
      break;
    default:
      throw "Bad fileType";
      break;
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
    // const fileTypeObject = await knowFileTypeFromBuffer(buffer);
    // if (!fileTypeObject) throw "Error determining file type";

    // const fileType = fileTypeObject.ext;
    // const ImageminPlugin = getImageminPlugin(fileType)

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
