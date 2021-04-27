/*
 * Returns the string so img.src can read it and display the buffer image correctly
 */
export default (buffer: Buffer) : string => 'data:image/jpeg;base64,' + buffer.toString('base64');