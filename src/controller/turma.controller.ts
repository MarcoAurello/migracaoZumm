import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import Migracao from "../model/migracao.model";
import Turma from "../model/turma.model";
import Aluno from "../model/aluno.model";
import TurmaAluno from '../model/turmaaluno.model';
const { uuid } = require('uuidv4')
//import Chamado from '../models/chamado-model';

class TurmaController implements IController {
  async all(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        // Parâmetros de paginação
        const page = req.query.page ? parseInt(req.query.page as string) : 1; // Número da página
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10; // Tamanho da página

        // Cálculo do deslocamento
        const offset = (page - 1) * pageSize;

        // Consulta ao banco de dados com suporte à paginação
        const registros = await Turma.findAll({ 
            where: {
                ativo: true,
            },
            order: [["turmaNome", "ASC"]],
            // include: [{
            //   model: TurmaAluno, as: 'TurmaAluno', include: [Turma]
            // }],
            // include: [TurmaAluno],

            include: [
              { model: TurmaAluno, include: [Aluno] },
             
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

  removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  criarEmail(nome: string, cpf: string): string {
    // Remover acentos dos nomes
    const primeiroNomeSemAcentos = this.removerAcentos(nome.split(' ')[0]);
    const ultimoNomeSemAcentos = this.removerAcentos(nome.split(' ')[nome.split(' ').length - 1]);

    // Pegar os 3 primeiros dígitos do CPF
    const cpfFormatado = cpf.replace(/[.-]/g, '').substring(0, 3);

    // Criar o email
    const email = `${primeiroNomeSemAcentos.toLowerCase()}${ultimoNomeSemAcentos.toLowerCase()}${cpfFormatado}@edu.pe.senac.br`;

    return email;
  }

  async migracaoService() {
    try {
      // Execute a consulta SQL para obter os dados de migração
      const result = await Migracao.sequelize?.query(`
            SELECT
                A.AlunoId,
                A.AlunoNome,
                A.AlunoCPF,
                A.AlunoEmail,
                T.TurmaId,
                T.TurmaNome,
                T.CodigoDaTurma,
                T.TurmaSituacao,
                T.TurmaDataDeInicio,
                T.TurmaDataDeTermino,
                M.TurmaCodigoFormatado
            FROM
                [DATASET_SIG].dbo.Analise_Turma T
            INNER JOIN
                [DATASET_SIG].dbo.Analise_Matricula M ON M.TurmaId = T.TurmaId
            INNER JOIN
                [DATASET_SIG].dbo.Analise_Aluno A ON M.AlunoId = A.AlunoId
            WHERE
                T.UnidadeOperativaId = 182 AND (T.TurmaSituacao = 'Liberada para Matrícula' OR T.TurmaSituacao = 'Em Processo')
        `);

      const todosAlunos = await Aluno.findAll({});
      const todasTurmas = await Turma.findAll({});


      for (const item of result[0]) {
        let turmaJaExiste = false;

        // Verificar se alguma turma existente tem o mesmo código
        for (const turma of todasTurmas) {
          if (turma.codigoFormatado === item['CodigoDaTurma']) {
            turmaJaExiste = true;
            console.log('Turma já existe:', item['CodigoDaTurma']);
            break; // Sair do loop assim que encontrar uma turma existente
          }
        }

        // Se a turma não existir, criar uma nova turma
        if (!turmaJaExiste) {
          console.log('Turma criada:', item['CodigoDaTurma']);

          const turmaNome = item['TurmaNome'] || 'Nome Indefinido';
          const codigoFormatado = item['CodigoDaTurma'] || 'Código Indefinido';
          const dataInicio = item['TurmaDataDeInicio'] || new Date().toISOString();
          const dataTermino = item['TurmaDataDeTermino'] || new Date().toISOString();

          const novaTurma = {
            id: uuid(),
            turmaNome,
            codigoFormatado,
            dataInicio,
            dataTermino,
            ativo: true,
            criadoNoTeams: false,
            fkUnidade: '7b284481-24fc-466e-97c3-300d86619425'
          };

          // Crie a nova turma no banco de dados
          await Turma.create(novaTurma);

          // Atualize a lista todasTurmas após criar a nova turma
          todasTurmas.push(novaTurma);
        }
      }


      for (const item of result[0]) {
        const alunoExistente = await Aluno.findOne({
            where: { cpf: item['AlunoCPF'] }
        });
    
        if (!alunoExistente) {
            console.log('Criando novo aluno');
    
            const nome = item['AlunoNome'] || 'Nome Indefinido';
            const cpf = item['AlunoCPF'] || 'Nome Indefinido';
            const email = this.criarEmail(nome, cpf);
    
            const novoAluno = {
                id: uuid(),
                nome,
                cpf,
                email,
                ativo: true,
                criadoNoTeams: false,
            };
    
            const alunoCriado = await Aluno.create(novoAluno);
    
            const turmaAtual = await Turma.findOne({
                where: { codigoFormatado: item['CodigoDaTurma'] }
            });
    
            if (turmaAtual) {
                console.log('Turma encontrada, criando relação');
    
                const novaTurmaAluno = {
                    id: uuid(),
                    fkAluno: alunoCriado.id,
                    fkTurma: turmaAtual.id
                };
    
                await TurmaAluno.create(novaTurmaAluno);
            } else {
                console.log('Turma não encontrada');
            }
        } else {
            console.log('Aluno já existe');
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

