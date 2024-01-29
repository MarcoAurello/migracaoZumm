import controller from '../controller/statusapplication.controller'
import { Router } from 'express'

class StatusApplicationRouter {
  public router!: Router

  constructor () {
    this.router = Router()
    this.routers()
  }

  private routers () {
    this.router.get('/', controller.all)
  }
}

export default new StatusApplicationRouter().router
