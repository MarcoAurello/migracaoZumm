import controller from '../controller/profissional.controller'
import { Router } from 'express'
import routerMiddleware from '../middleware/router.middleware'

class ProfissionalRouter {
  public router!: Router

  constructor () {
    this.router = Router()

    // Configura rotas públicas
    this.router.use('/public', this.publicRouters())

    // Configura rotas privadas com autenticação
    this.router.use(routerMiddleware.authenticated)
    this.privateRouters()
  }

  private privateRouters() {
    this.router.get('/search/', controller.search)
    this.router.get('/', controller.all)
    this.router.get('/email', controller.email)
    this.router.post('/', controller.create)
    this.router.get('/:id', controller.find)
    this.router.post('/:id/edit', controller.update)
    this.router.post('/:id/delete', controller.delete)
  }

  private publicRouters() {
    const publicRouter = Router()
    publicRouter.get('/emailApi/:email/:id', controller.emailApi) // Exemplo de rota pública
    return publicRouter
  }
}

export default new ProfissionalRouter().router
