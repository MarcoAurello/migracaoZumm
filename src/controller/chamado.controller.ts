import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import Chamado from "../model/chamado.model";
import Usuario from "../model/usuario.model";
import Unidade from "../model/unidade.model";
// import Status from "../model/status.model";

class ChamadoController implements IController {
  async all(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const registros = await Chamado.findAll({
        where: {
          flagDemandado: false,
        },
        order: [["createdAt", "DESC"]],
        include: [Usuario, Unidade, 
            // Status
        ],
      });

      console.log(JSON.stringify(registros))
      res.status(200).json({ data: registros });
    } catch (err) {
      res.status(401).json({ data: null, mesage: err });
      console.log(err);
    }
  }

  async create(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const {
        
        tituloChamado,
        descricao,
      
      } = req.body;
        
      const registro = await Chamado.create({
        tituloChamado,
        descricao,
        // criticidade,
        // caminho,
        // fkUnidade,
         fkStatus: '6a28e7b5-e8ed-4def-84a0-2754a6ce914e',
        fkUsuario : req.usuario.id,
         flagDemandado : false,
      });
      

      res
        .status(200)
        .json({ data: registro, message: "Chamado cadastrado com sucesso. " });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.errors[0].message });
    }
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;

      const registro = await Chamado.findOne({
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

export default new ChamadoController();
