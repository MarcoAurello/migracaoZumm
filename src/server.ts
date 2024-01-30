import express, { json } from 'express'
import cors from 'cors'

import routerStatusApplication from './router/statusapplicatoin.router'
import routerAuthentication from './router/authentication.router'
import routerUsuario from './router/usuario.router'
import routerUnidade from './router/unidade.router'
import routerArea from './router/area.router'
import routerPerfil from './router/perfil.router'
import routerChamado from './router/chamado.router'
import routerConfiguracaoGlobal from './router/configuracaoGlobal.router'
import routerAlunoTeams from './router/alunoteams.router'
import routerTurnoAluno from './router/turmaaluno.router'
import protocolo from './utils/protocolo.utils'

const path = require('path')

class Server {
  public application!: express.Application

  constructor () {
    console.log(protocolo())
    this.application = express()
    this.middlewares()
    this.routers()
  }

  private middlewares () {
    this.application.use(json())
    this.application.use(cors())
  }

  private routers () {
    this.application.use('/api/statusapplication/', routerStatusApplication)
    this.application.use('/api/authentication/', routerAuthentication)
    this.application.use('/api/usuario/', routerUsuario)
    this.application.use('/api/unidade/', routerUnidade)
    this.application.use('/api/area/', routerArea)
    this.application.use('/api/perfil/', routerPerfil)
    this.application.use('/api/chamado/', routerChamado)
    this.application.use('/api/configuracao/', routerConfiguracaoGlobal)
    this.application.use('/api/alunoteams/', routerAlunoTeams)
    this.application.use('/api/turnoaluno/', routerTurnoAluno)
    this.application.use(express.static(path.resolve('app', 'build')))
    this.application.get('/*', (req, res) =>
      res.sendFile(path.resolve('app', 'build', 'index.html'))
    )
  }
}

export default new Server().application
