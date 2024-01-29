import controller from '../controller/area.controller'
import { Router } from 'express'

import routerMiddleware from '../middleware/router.middleware'
import PerfilUtils from '../utils/perfil.utils'

class AreaRouter {
  public router!: Router

  constructor () {
    this.router = Router()
    this.router.use(routerMiddleware.authenticated)
    this.routers()
  }

  private routers () {
    this.router.get('/search/', controller.search)
    this.router.get('/', controller.all)
    this.router.post('/', routerMiddleware.role([PerfilUtils.Administrador]), controller.create)
    this.router.get('/:id', controller.find)
    this.router.post('/:id/edit', routerMiddleware.role([PerfilUtils.Administrador]), controller.update)
    this.router.post('/:id/delete', routerMiddleware.role([PerfilUtils.Administrador]), controller.delete)
  }
}

export default new AreaRouter().router
