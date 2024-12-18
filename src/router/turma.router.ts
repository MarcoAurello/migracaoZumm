import controller from '../controller/turma.controller'
import { Router } from 'express'

import routerMiddleware from '../middleware/router.middleware'

class TurmaRouter {
  public router!: Router

  constructor () {
    this.router = Router()
    // this.router.use(routerMiddleware.authenticated)
    this.routers()
  }

  private routers () {
    this.router.get('/search/', controller.search)
    this.router.get('/', controller.all)
    this.router.get('/viewProfessores', controller.viewProfessores)
    this.router.get('/viewTurma', controller.viewTurma)
    this.router.post('/', controller.create)
    this.router.post('/criarEquipe/:turmaId', controller.criarEquipe)
    this.router.get('/:id', controller.find)
    this.router.post('/:id/edit', controller.update)
    this.router.post('/:id/delete', controller.delete)
  }
}

export default new TurmaRouter().router
