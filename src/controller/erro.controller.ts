import { Request, Response, NextFunction } from 'express'
import { IController } from './controller.inteface'
import Erro from '../model/erro.model'

class ErroController implements IController {
    async all(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const registros = await Erro.findAll({
                order: [['createdAt', 'DESC']], // Ordena do mais recente para o mais antigo
            });
    
            res.status(200).json({ data: registros });
        } catch (err) {
            res.status(401).json({ message: err.errors[0].message });
        }
    }

  async create (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
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

  async search(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const { pesquisa } = req.query;
      console.log('wild'+pesquisa);
      
      // const registros = await Aluno.findAll({
       
      // });
      // console.log('wild'+JSON.stringify(registros));

      // res.status(200).json({ data: registros });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.errors[0].message });
    }
  }
}


export default new ErroController()
