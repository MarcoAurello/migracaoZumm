import { Request, Response, NextFunction } from 'express'
import { IController } from './controller.inteface'
import AdmTurma from '../model/admTurma.model'
import Turma from '../model/turma.model'
const { uuid } = require('uuidv4')

class AdmTurmaController implements IController {
    async all (req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
          const registros = await AdmTurma.findAll({
            order: [['nome', 'asc']]
          })
    
          res.status(200).json({ data: registros })
        } catch (err) {
          res.status(401).json({ message: err.errors[0].message })
        }
      }


      async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
          const { cadEmailAdm,
            unidadeAdm,
            nomeAdm
        } = req.body;
    
          const registro = await AdmTurma.create({
            id: uuid(),
           nome: nomeAdm,
           email:cadEmailAdm,
           unidade:unidadeAdm
          });
    
          res
            .status(200)
            .json({ data: registro, message: "Cadastrado com Sucesso " });
        } catch (err) {
          res.status(401).json({ message: err.errors[0].message });
        }
      }
    

      async find(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
          const { id } = req.params;
    
         
    
          let registro = await AdmTurma.findOne({ where: { unidade: id } });
    
          console.log('235' + JSON.stringify(registro));
    
          
    
          res.status(200).json({ data: registro });
        } catch (err) {
          // Improved error handling
          const message = err.errors && err.errors.length > 0
            ? err.errors[0].message
            : 'An error occurred';
    
          res.status(401).json({ message });
        }
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

export default new AdmTurmaController()
