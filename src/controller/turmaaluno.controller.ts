import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import Aluno from "../model/aluno.model";
import Turma from "../model/turma.model";
import TurmaAluno from '../model/turmaaluno.model';
//import Chamado from '../models/chamado-model';

class TurmaAlunocontroller implements IController {
    async all(req: Request, res: Response, next: NextFunction): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async find(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
          const { id } = req.params;
    
          let registro = [];
    
          registro = await TurmaAluno.findAll({
            where: { fkTurma: id },
            include: [
              {
                model: Aluno,
               
              },
              {
                model: Turma,
               
              },
            
            ],
          });
    
         
      
          console.log("11111111111111" + JSON.stringify(registro));
    
          res.status(200).json({ data: registro });
        } catch (err) {
          console.log(err);
          res.status(401).json({ message: err.errors[0].message });
        }
      }

    async update(req: Request, res: Response, next: NextFunction): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async search(req: Request, res: Response, next: NextFunction): Promise<any> {
        throw new Error("Method not implemented.");
    }
}

export default new TurmaAlunocontroller();
