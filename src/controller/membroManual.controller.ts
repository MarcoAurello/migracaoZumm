import { Request, Response, NextFunction } from 'express'
import { IController } from './controller.inteface'
import membroManual from '../model/membroManula.model'
import ControllerTurma from '../controller/turma.controller'

class MembroManualController implements IController {
  async all (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const registros = await membroManual.findAll({ order: [['nome', 'asc']] })

      res.status(200).json({ data: registros })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const {
        idTurma,
        email
      } = req.body

      console.log('dis'+idTurma)


      const cadastro = await ControllerTurma.adcio

    //   const registro = await Unidade.create({
    //     nome,
    //     descricao
    //   })

    //   res.status(200).json({ data: registro, message: 'Cadastro realizado com sucesso.' })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
  }
  
  async find (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async delete (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async search (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }
}

export default new MembroManualController()
