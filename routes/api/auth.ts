/**
## Login
POST `/login`

## Register
POST `/register`
**/

import express from 'express'
import * as authController from '../../controllers/api/auth'
import * as authMiddlewares from '../../middlewares/Auth'

const router = express.Router()

router.get('/', (req: express.Request, res: express.Response) => {
  res.send('Welcome to the auth routes')
})

router.post('/login', authController.login)

router.post('/googleLogin', authController.googleLogin)

router.get('/proc', authMiddlewares.authorize, authController.proc)

export default router