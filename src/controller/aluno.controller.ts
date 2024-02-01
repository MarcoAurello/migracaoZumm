import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import aluno from "../model/aluno.model";
import TurmaAluno from '../model/turmaaluno.model';
import Turma from '../model/turma.model';
//import Chamado from '../models/chamado-model';

class AlunoController implements IController {
  async all(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        // Parâmetros de paginação
        const page = req.query.page ? parseInt(req.query.page as string) : 1; // Número da página
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10; // Tamanho da página

        // Cálculo do deslocamento
        const offset = (page - 1) * pageSize;

        // Consulta ao banco de dados com suporte à paginação
        const registros = await aluno.findAll({ 
            where: {
                ativo: true,
            },
            // include: [{
            //   model: TurmaAluno, as: 'TurmaAluno', include: [Turma]
            // }],
            include: [TurmaAluno],

            limit: pageSize, // Limite de registros por página
            offset: offset, // Deslocamento
        });
        console.log("uiuiuiu"+ JSON.stringify(registros))

        res.status(200).json({ 
            data: registros,
            currentPage: page, // Página atual
            pageSize: pageSize, // Tamanho da página
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
}

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error("Method not implemented.");
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

export default new AlunoController();
