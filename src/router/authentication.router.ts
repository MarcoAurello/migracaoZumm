import controller from '../controller/authentication.controller'
import { Router } from 'express'

import routerMiddleware from '../middleware/router.middleware'

class AuthenticationRouter {
  public router!: Router

  constructor () {
    this.router = Router()
    this.routers()
  }

  private routers () {
    this.router.post('/', controller.login)
    this.router.get('/logged', routerMiddleware.authenticated, controller.logged)
  }
}

export default new AuthenticationRouter().router
