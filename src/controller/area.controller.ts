import { Request, Response, NextFunction } from 'express'
import { IController } from './controller.inteface'
import Area from '../model/area.model'
import Unidade from '../model/unidade.model'

class AreaController implements IController {
  async all (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const registros = await Area.findAll({ order: [['nome', 'asc']] })
      console.log('pppss')

      res.status(200).json({ data: registros })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
  }
  async create (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const {
        nome,
        descricao,
        fkUnidade
      } = req.body

      const registro = await Area.create({ nome, descricao, fkUnidade })

      res.status(200).json({ data: registro, message: 'Cadastro realizado com sucesso.' })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async find (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params

      const registro = await Area.findOne({ where: { id } })

      res.status(200).json({ data: registro })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params
      const { nome, descricao, fkUnidade } = req.body

      console.log(fkUnidade)

      let registro = await Area.findOne({ where: { id } })

      let params = { }
      params = registro?.nome !== nome ? { ...params, nome } : params
      params = registro?.descricao !== descricao ? { ...params, descricao } : params
      params = registro?.fkUnidade !== fkUnidade ? { ...params, fkUnidade } : params

      await Area.update(params, {
        where: {
          id
        },
        individualHooks: true
      })

      registro = await Area.findOne({ where: { id } })

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
}

export default new AreaController()
