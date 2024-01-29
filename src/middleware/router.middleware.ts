import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import Perfil from '../model/perfil.model'
import Usuario from '../model/usuario.model'

const { promisify } = require('util')

class RouterMiddleware {
  async authenticated (req: any, res: Response, next: NextFunction) {
    const { authorization } = req.headers

    if (!authorization) {
      return res.status(401).json({ message: 'Token not provided.' })
    }

    const [, token] = authorization.split(' ')

    try {
      const decoded = await promisify(jwt.verify)(token, 'c43e4311194ab5795eaf4db533b8172d')

      req.usuario = await Usuario.findOne({
        where: { id: decoded.id },
        include: [Perfil]
      })

      return next()
    } catch (err) {
      return res.status(401).json({ message: 'Token not provided.' })
    }
  }

  public role (perfis: Array<string>) {
    return [
      async (req, res, next) => {
        try {
          if (!req.usuario.validado) {
            return res.status(401).json({ message: 'Você não possui permissão para acessar este recurso.' })
          }

          if (req.usuario.Perfil) {
            if (!perfis.includes(req.usuario.Perfil.nome)) {
              return res.status(401).json({ message: 'Você não possui permissão para acessar este recurso.' })
            }
          } else {
            return res.status(401).json({ message: 'Você não possui permissão para acessar este recurso.' })
          }
        } catch (err) {
          return res.status(401).json({ message: 'Você não possui permissão para acessar este recurso.' })
        }

        return next()
      }
    ]
  }
}

export default new RouterMiddleware()
