import controller from '../controller/aluno.controller'
import { Router } from 'express'

import routerMiddleware from '../middleware/router.middleware'

class AlunoRouter {
  public router!: Router

  constructor () {
    this.router = Router()
    this.router.use(routerMiddleware.authenticated)
    this.routers()
  }

  private routers () {
    this.router.get('/search/', controller.search)
    this.router.get('/', controller.all)
    this.router.get('/alunoView', controller.alunoView)
    this.router.post('/', controller.create)
    this.router.post('/vincularAllEmailInstitucional', controller.vincularAllEmailInstitucional)
    this.router.post('/createEmailInstitucional', controller.createEmailInstitucional)
    this.router.post('/createAllEmailInstitucional', controller.createAllEmailInstitucional)
    this.router.get('/:id', controller.find)
   
    this.router.post('/:id/edit', controller.update)
    this.router.post('/:id/delete', controller.delete)
  }
}

export default new AlunoRouter().router
