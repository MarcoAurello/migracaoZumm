import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import aluno from "../model/aluno.model";
import TurmaAluno from '../model/turmaaluno.model';
import Turma from '../model/turma.model';
const qs = require('qs');
const axios = require('axios');
//import Chamado from '../models/chamado-model';

async function obterToken() {
  const data = {
    client_id: '177b3dca-d0f7-4ac0-883a-7a389357a93d',
    scope: 'https://graph.microsoft.com/.default',
    client_secret: 'R8N8Q~cuDCI7VJvkQpwZrLYo1UQ22-YtHfCiZa9n',
    grant_type: 'client_credentials'
  };

  try {
    const response = await axios.post('https://login.microsoftonline.com/4a22f116-51ce-4fe3-aeaa-9c46143d088b/oauth2/v2.0/token', qs.stringify(data));
    return response.data.access_token;
  } catch (error) {
    console.error("Erro ao obter token:", error.response ? error.response.data : error.message);
    throw error;
  }
}



async function obterUsuarios(variavelEmail) {
  const token = await obterToken();
  const endpoint = `https://graph.microsoft.com/v1.0/users?$filter=endswith(mail,'${variavelEmail}')&$orderby=userPrincipalName&$count=true`;

  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        ConsistencyLevel: 'eventual'
      }
    });
    const usuarios = response.data.value;
    const ids = usuarios.map(usuario => usuario.id);
    return ids;
  } catch (error) {
    console.error('Erro ao fazer requisição:', error.response.data);
    throw error;
  }
}

async function adicionarMembroEquipe( teamId, userId) {
  const token = await obterToken();
  const endpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/members`;

  const membro = {
    "@odata.type": "#microsoft.graph.aadUserConversationMember",
    "roles": [],  // ou ["member"] dependendo da função desejada
    "user@odata.bind": `https://graph.microsoft.com/v1.0/users/${userId}`
  };

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(endpoint, membro, { headers });
    console.log('Membro adicionado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar membro:', error.response ? error.response.data : error.message);
    throw error;
  }
}

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
            include: [
              {
                  model: TurmaAluno,
                  include: [Turma]
              }
          ],
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

async create(req: any, res: Response, next: NextFunction): Promise<any> {
  try {
    const {
      
      idTurma,
      email,
    
    } = req.body;

    const userId = await obterUsuarios(email)
    const turmaAtual = await Turma.findOne({
      where: { id :idTurma}

    });

    const idTemansTurma =  turmaAtual?.idTurmaTeams

   adicionarMembroEquipe(idTemansTurma,userId)



   

    const registro = []
      
 

    res
      .status(200)
      .json({ data: registro, message: "Vinculo Criado. " });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: err.errors[0].message });
  }
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
