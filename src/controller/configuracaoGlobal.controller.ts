import { Request, Response, NextFunction } from 'express'
import ConfiguracaoGeral from '../model/configuracaoGeral.model'
import emailUtils from '../utils/email.utils'
import { IController } from './controller.inteface'

class ConfiguracaoGlobalController implements IController {
  async all (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const registro = await ConfiguracaoGeral.findOne()

      res.status(200).json({ data: registro })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async find (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params
      const {
        email,
        password,
        host,
        porta,
        autenticacaoAd,
        ssl,
        template,
        urlAd,
        baseDN,
        usernameAd,
        passwordAd
      } = req.body

      await ConfiguracaoGeral.update({
        email,
        password,
        host,
        porta,
        autenticacaoAd,
        ssl,
        template,
        urlAd,
        baseDN,
        usernameAd,
        passwordAd
      }, {
        where: {
          id
        },
        individualHooks: true
      })

      const registro = await ConfiguracaoGeral.findOne()

      res.status(200).json({ data: registro, message: 'Alteração realizada com sucesso.' })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async delete (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async search (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async enviarEmailDeTeste (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const {
        to,
        message
      } = req.body

      await emailUtils.enviar(to, message)
        .then(() => {
          return res.status(200).json({ message: 'Email enviado com sucesso.' })
        })
        .catch(err => {
          return res.status(401).json({ message: JSON.stringify(err) })
        })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
  }
}

export default new ConfiguracaoGlobalController()
