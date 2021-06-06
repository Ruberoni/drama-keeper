import { Request, Response, NextFunction } from 'express'

export default function requestAuthorization(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'production') {
    try {
      const requestAuthHeader = req.get('authorization')
      if (!requestAuthHeader) throw new Error("Please provide the authorization header.")
      
      const requestToken = requestAuthHeader.replace(/^Bearer\s+/, "")
      if (!requestToken) throw new Error("Please provide the authorization header.")

      if (!process.env.SERVER_AUTH_TOKEN) throw new Error("Please provide the SERVER_AUTH_TOKEN env variable.")
      if (process.env.SERVER_AUTH_TOKEN === requestToken){
        next()
        return
      }
      res.status(400).end("Unauthorized.")
      return

    } catch (err) {
      res.status(400).end(err.message)
      return

    }
    
  }
  next()
}