import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import status from "../model/status.model";
//import Chamado from '../models/chamado-model';

class StatusController implements IController {
  async all(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const registros = await status.findAll(

        
      );

      res.status(200).json({ data: registros });
    } catch (err) {
      res.status(401).json({ data: null, mesage: err });
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { descricao,} = req.body;

      const registro = await status.create({
        descricao
      });

      res
        .status(200)
        .json({ data: registro, message: "Chamado cadastrado com sucesso. " });
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message });
    }
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;

      const registro = await status.findOne({
        where: {
          id,
        },
      });

      res.status(200).json({ data: registro });
    } catch (err) {
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

export default new StatusController();
