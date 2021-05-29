import { CorsOptions } from 'cors'

/**
    CORS
 */
/*
const whitelist = [process.env.CLIENT_URL, '*']
const checkWhitelist : CorsOptions['origin'] =  (origin, callback) => {
  if (whitelist.indexOf(origin) !== -1) {
    callback(null, true)
  } else {
    callback(new Error('Not allowed by CORS'))
  }
}
*/

let corsOptions : CorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

if(process.env.NODE_ENV === 'production') {
  corsOptions = { 
    origin: process.env.CLIENT_URL || '*',
    optionsSuccessStatus: 200
  }
}

export {
  corsOptions
}