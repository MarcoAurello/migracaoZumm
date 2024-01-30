import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import Migracao from "../model/migracao.model";
import Turma from "../model/turma.model";
const { uuid } = require('uuidv4')
//import Chamado from '../models/chamado-model';

class TurmaController implements IController {
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

  async migracaoService() {
    try {
        const result = await Migracao.sequelize?.query("SELECT A.AlunoId, A.AlunoNome, A.AlunoCPF,  A.AlunoEmail, T.TurmaId, T.TurmaNome,  T.CodigoDaTurma, T.TurmaSituacao, T.TurmaDataDeInicio, T.TurmaDataDeTermino,  M.TurmaCodigoFormatado  FROM [DATASET_SIG].dbo.Analise_Turma T INNER JOIN [DATASET_SIG].dbo.Analise_Matricula M ON M.TurmaId = T.TurmaId INNER JOIN [DATASET_SIG].dbo.Analise_Aluno A ON M.AlunoId = A.AlunoId  WHERE  T.UnidadeOperativaId = 182 AND (T.TurmaSituacao = 'Liberada para Matrícula' OR T.TurmaSituacao = 'Em Processo')");
        // console.log('JSON retornado:', result);

        // interface TurmaItem {
        //     TurmaNome: string;
        //     CodigoDaTurma: string;
        //     TurmaDataDeInicio: string;
        //     TurmaDataDeTermino: string;
        //     // Adicione outras propriedades conforme necessário
        // }
        


        if (result && result.length > 0) {

         
          for (const item of result ) {
            console.log('Item:', item.TurmaNome);

            const turmaNome = item?.TurmaNome || 'Nome Indefinido';
            
            // Use as datas diretamente se já estiverem no formato correto
            const dataInicio = item?.TurmaDataDeInicio || new Date().toISOString();
            const dataTermino = item?.TurmaDataDeTermino || new Date().toISOString();
        
            // Crie uma instância de Turma com valores padrão
            const novaTurma = {
                id: uuid(),
                turmaNome,
                codigoFormatado: item?.CodigoDaTurma || 'Código Indefinido',
                dataInicio,
                dataTermino,
                ativo: true,
                criadoNoTeams: false,
                fkUnidade: '7b284481-24fc-466e-97c3-300d86619425'
            };
        
            // Cria o registro da turma no banco de dados
            await Turma.create(novaTurma);
        }
        
        }

        console.log('Dados migrados com sucesso ao iniciar a aplicação.');
    } catch (err) {
        console.error('Erro ao migrar os dados:', err);
        // Adicione tratamento de erro aqui conforme necessário
    }
}


}




export default new TurmaController();

