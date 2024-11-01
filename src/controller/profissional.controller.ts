import { Request, Response, NextFunction } from 'express'
import { IController } from './controller.inteface'
import Profissional from '../model/profissional.model'
const { Op } = require('sequelize');

class ProfissionalController implements IController {
  async all(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
     
      const registros = await Profissional.findAll({
        // where: {
        //     ativo: true,
        // },
        // attributes: ['fkAluno', 'nome', 'emailCriado', 'alunoVinculado', 'email']
    });
    
      console.log("uiuiuiu" + JSON.stringify(registros))

      res.status(200).json({
        data: registros,
        // currentPage: page, // Página atual
        // pageSize: pageSize, // Tamanho da página
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
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
      const { pesquisa } = req.query
      console.log('qqqqqqq'+pesquisa)


      const registros = await Profissional.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.like]: `%${pesquisa}%` } },
            // { cpf: { [Op.like]: `%${pesquisa}%` } },
           
          ]
        },
      
      });




      console.log("______________" + JSON.stringify(registros))

      res.status(200).json({ data: registros })
    } catch (err) {
      console.log(err)
      if (typeof err.errors !== 'undefined') {
        res.status(401).json({ message: err.errors[0].message })
      } else if (typeof err.message !== 'undefined') {
        res.status(401).json({ message: err.message })
      } else {
        res.status(401).json({ message: 'Aconteceu um erro no processamento da requisição, por favor tente novamente.' })
      }
    }
  }

}

export default new ProfissionalController()
