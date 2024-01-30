import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import alunoTeams from "../model/alunoteams.model";
//import Chamado from '../models/chamado-model';

class AlunoTeamsController implements IController {
    async all(req: Request, res: Response, next: NextFunction): Promise<any> {
        throw new Error("Method not implemented.");
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

export default new AlunoTeamsController();
