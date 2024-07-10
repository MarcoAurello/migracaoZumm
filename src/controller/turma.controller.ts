import { IController } from './controller.inteface'
const fetch = require('node-fetch');
import { Request, Response, NextFunction } from "express";
import Migracao from "../model/migracao.model";
import Turma from "../model/turma.model";
import Aluno from "../model/aluno.model";
import TurmaAluno from '../model/turmaaluno.model';
const qs = require('qs');
const axios = require('axios');
import turmaalunoController from './turmaaluno.controller';
const { uuid } = require('uuidv4')
//import Chamado from '../models/chamado-model';


async function obterTokenDeAcesso() {
  const tenantId = '4a22f116-51ce-4fe3-aeaa-9c46143d088b';
  const clientId = '177b3dca-d0f7-4ac0-883a-7a389357a93d';


  const scope = 'https://graph.microsoft.com/.default';

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const body = qs.stringify({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: scope
  });

  try {
    const response = await axios.post(url, body, { headers });
    const token = response.data.access_token;
    console.log('Token de acesso:', token);
    return token;
  } catch (error) {
    console.error('Erro ao obter token de acesso:', error.response.data);
    throw error;
  }
}


async function listarTemplates(accessToken: string) {
  const endpoint = 'https://graph.microsoft.com/v1.0/teamsTemplates';

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Templates disponíveis:');
      data.value.forEach((template: any) => {
        console.log(`ID: ${template.id}, Display Name: ${template.displayName}`);
      });
      return data.value;
    } else {
      const errorData = await response.json();
      console.error('Erro ao listar templates:', errorData);
      throw new Error('Erro ao listar templates');
    }
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    throw new Error('Erro ao listar templates');
  }
}

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
      console.log("uiuiuiu" + JSON.stringify(registros))

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

  // async criarEquipe(req: Request, res: Response, next: NextFunction): Promise<any> {
  //   const turmaId = req.params.turmaId;
  //   try {
  //       // Lógica para obter informações da turma, como nome, descrição, etc., conforme necessário
  //       const registros = await Turma.findOne({ 
  //         where: {
  //             id: turmaId,
  //         },

  //     });
  //       // Exemplo de chamada à API do Microsoft Graph para criar uma equipe
  //       const graphEndpoint = 'https://graph.microsoft.com/v1.0/teams';
  //       const accessToken ="eyJ0eXAiOiJKV1QiLCJub25jZSI6ImFuNVNzMlRJRUM0V1R3VGRGcGVaOU96UEZLc3loNURoVExLWnJpS0lnREEiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1HTHFqOThWTkxvWGFGZnBKQ0JwZ0I0SmFLcyIsImtpZCI6Ik1HTHFqOThWTkxvWGFGZnBKQ0JwZ0I0SmFLcyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80YTIyZjExNi01MWNlLTRmZTMtYWVhYS05YzQ2MTQzZDA4OGIvIiwiaWF0IjoxNzIwNTU1MzMwLCJuYmYiOjE3MjA1NTUzMzAsImV4cCI6MTcyMDU1OTIzMCwiYWlvIjoiRTJkZ1lQQllkUG5YL1ZKRnA2VVYxb3c5ZFE5ZkF3QT0iLCJhcHBfZGlzcGxheW5hbWUiOiJBdXRvbWHDp8OjbyBuYSBjcmlhw6fDo28gZGUgdHVybWFzIHRlYW1zIiwiYXBwaWQiOiIxNzdiM2RjYS1kMGY3LTRhYzAtODgzYS03YTM4OTM1N2E5M2QiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80YTIyZjExNi01MWNlLTRmZTMtYWVhYS05YzQ2MTQzZDA4OGIvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiJmMmM0ZmMyOC1lOGUzLTQ4YzMtODdjYi1lNGM2ODA0YTk0MTQiLCJyaCI6IjAuQVVVQUZ2RWlTczVSNDAtdXFweEdGRDBJaXdNQUFBQUFBQUFBd0FBQUFBQUFBQUJGQUFBLiIsInJvbGVzIjpbIkNoYW5uZWxTZXR0aW5ncy5SZWFkLkFsbCIsIkdyb3VwLlJlYWQuQWxsIiwiRGlyZWN0b3J5LlJlYWRXcml0ZS5BbGwiLCJUZWFtLkNyZWF0ZSIsIkdyb3VwLkNyZWF0ZSIsIkdyb3VwLlJlYWRXcml0ZS5BbGwiLCJVc2VyLlJlYWQuQWxsIiwiVGVhbS5SZWFkQmFzaWMuQWxsIiwiTWVtYmVyLlJlYWQuSGlkZGVuIl0sInN1YiI6ImYyYzRmYzI4LWU4ZTMtNDhjMy04N2NiLWU0YzY4MDRhOTQxNCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJTQSIsInRpZCI6IjRhMjJmMTE2LTUxY2UtNGZlMy1hZWFhLTljNDYxNDNkMDg4YiIsInV0aSI6IkxuZ2xTVDZnYkVPYzdTdktkWHduQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjA5OTdhMWQwLTBkMWQtNGFjYi1iNDA4LWQ1Y2E3MzEyMWU5MCJdLCJ4bXNfaWRyZWwiOiI3IDQiLCJ4bXNfdGNkdCI6MTQ0NDMxNjE3Nn0.FHjQORpFn8E32Kpr7oD8OvJBINhbAGFy9uIfCC8aFpxYlx0bh-YVDwXbkhh0dvelg4qYbqexqHyqnzlrkrv4dGToyAa8LBca-j7gp2CYc8nVbGf_lMwUz60kCU_CAIN_GE5bYSLfD97cQcW1rbJjN8seVKRIxBPsQkA4Tg8gXAiIJ2wJpNcBSIB0rLbp_2UOx0EUEMd0FtDSuDgJ21u7Bx4UTYIebHTBOIir9QEWyDzrqsRedSqEYXwVPMxxZZAmUjAD7pzURzDN1-esOza1kGQHz1Lpue6Il6EkzoD5Mj6YOqH3hQkf2wjMOUfLHbe6NPY6ebYlKVGcWVQeelh1gQ"
  //       const requestBody = {
  //           "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
  //           "displayName": "Equipe " + registros?.turmaNome,
  //           "description": "Equipe para a turma " + registros?.codigoFormatado
  //       };

  //       const response = await fetch(graphEndpoint, {
  //           method: 'POST',
  //           headers: {
  //               'Authorization': `Bearer ${accessToken}`,
  //               'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify(requestBody)
  //       });

  //       const data = await response.json();

  //       if (response.ok) {
  //           console.log('Resposta da API do Microsoft Graph:', data);
  //           res.status(200).json({ message: 'Equipe criada com sucesso!' });
  //       } else {
  //           console.error('Erro ao criar equipe:', data);
  //           res.status(500).json({ error: 'Erro ao criar equipe' });
  //       }
  //   } catch (error) {
  //       console.error('Erro ao criar equipe:', error);
  //       res.status(500).json({ error: 'Erro ao criar equipe' });
  //   }
  // }

  // async  criarEquipe(req: Request, res: Response, next: NextFunction): Promise<any> {
  //   const turmaId = req.params.turmaId;

  //   try {
  //     // Lógica para obter informações da turma, como nome, descrição, etc., conforme necessário
  //     const registros = await Turma.findOne({ 
  //       where: { id: turmaId },
  //     });

  //     if (!registros) {
  //       return res.status(404).json({ error: 'Turma não encontrada' });
  //     }

  //     // Obter o token de acesso
  //     const accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjdLcThBM3dqcVpJZHR4TXhBVHFobUl1dTNxWU8tc0RyY1BxaElZazFENTgiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1HTHFqOThWTkxvWGFGZnBKQ0JwZ0I0SmFLcyIsImtpZCI6Ik1HTHFqOThWTkxvWGFGZnBKQ0JwZ0I0SmFLcyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80YTIyZjExNi01MWNlLTRmZTMtYWVhYS05YzQ2MTQzZDA4OGIvIiwiaWF0IjoxNzIwNTU1NjI3LCJuYmYiOjE3MjA1NTU2MjcsImV4cCI6MTcyMDU1OTUyNywiYWlvIjoiRTJkZ1lMQmJjenJsZStYOER3ZEVmbGdHeGk1TUJRQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJBdXRvbWHDp8OjbyBuYSBjcmlhw6fDo28gZGUgdHVybWFzIHRlYW1zIiwiYXBwaWQiOiIxNzdiM2RjYS1kMGY3LTRhYzAtODgzYS03YTM4OTM1N2E5M2QiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80YTIyZjExNi01MWNlLTRmZTMtYWVhYS05YzQ2MTQzZDA4OGIvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiJmMmM0ZmMyOC1lOGUzLTQ4YzMtODdjYi1lNGM2ODA0YTk0MTQiLCJyaCI6IjAuQVVVQUZ2RWlTczVSNDAtdXFweEdGRDBJaXdNQUFBQUFBQUFBd0FBQUFBQUFBQUJGQUFBLiIsInJvbGVzIjpbIkNoYW5uZWxTZXR0aW5ncy5SZWFkLkFsbCIsIkdyb3VwLlJlYWQuQWxsIiwiRGlyZWN0b3J5LlJlYWRXcml0ZS5BbGwiLCJUZWFtLkNyZWF0ZSIsIkdyb3VwLkNyZWF0ZSIsIkdyb3VwLlJlYWRXcml0ZS5BbGwiLCJVc2VyLlJlYWQuQWxsIiwiVGVhbS5SZWFkQmFzaWMuQWxsIiwiTWVtYmVyLlJlYWQuSGlkZGVuIl0sInN1YiI6ImYyYzRmYzI4LWU4ZTMtNDhjMy04N2NiLWU0YzY4MDRhOTQxNCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJTQSIsInRpZCI6IjRhMjJmMTE2LTUxY2UtNGZlMy1hZWFhLTljNDYxNDNkMDg4YiIsInV0aSI6IlZpY0tHWlM1ejBhNzRHdTFScWsyQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjA5OTdhMWQwLTBkMWQtNGFjYi1iNDA4LWQ1Y2E3MzEyMWU5MCJdLCJ4bXNfaWRyZWwiOiI3IDQiLCJ4bXNfdGNkdCI6MTQ0NDMxNjE3Nn0.OeezHZazqHtJNG-NrOmj8HnIPGmCBaVHPZqoJwKIoEhKEoeitrbe2UpR35n3SRMRKRVv9E4ndwjE4wie3iB5hB-NnsrJTqOVz7bJ2raNQpLcXwq8AsuXqnZMged9E3SnXhGE4MOhDeOKWa07nHZ16oTd0xqAsk8IiagH3_YBKDMtho673IZQ_gEgr2I7AW1PZR4JCGZWQ5U4KluveK3zU8CvEpxKMs4qdBHwWwLKCsgGTlrQFjxXlsOvFAdOip_bjcqMZ3GsXddlSUfAPE4QK28GZbEqK6J4giVTqHRfzWxKfPv18if6IIsPL0mSTMHNWnUcUqSt-1gvAZzkSCZyrQ"

  //     // Dados da requisição
  //     const requestBody = {
  //       "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
  //       "displayName": "Equipe " + registros.turmaNome,
  //       "description": "Equipe para a turma " + registros.codigoFormatado,
  //       "members": [
  //         {
  //           "@odata.type": "#microsoft.graph.aadUserConversationMember",
  //           "roles": ["owner"],
  //           "user@odata.bind": "https://graph.microsoft.com/v1.0/users/{user-id}"  // Substitua {user-id} pelo ID do usuário que será o proprietário
  //         }
  //       ]
  //     };

  //     const response = await fetch('https://graph.microsoft.com/v1.0/teams', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(requestBody)
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       console.log('Resposta da API do Microsoft Graph:', data);
  //       res.status(200).json({ message: 'Equipe criada com sucesso!' });
  //     } else {
  //       console.error('Erro ao criar equipe:', data);
  //       res.status(500).json({ error: 'Erro ao criar equipe', details: data });
  //     }
  //   } catch (error) {
  //     console.error('Erro ao criar equipe:', error);
  //     res.status(500).json({ error: 'Erro ao criar equipe', details: error.message });
  //   }
  // }


  async  criarEquipe(req, res, next) {
    const turmaId = req.params.turmaId;
  
    try {
      // Lógica para obter informações da turma, como nome, descrição, etc., conforme necessário
      const registros = await Turma.findOne({
        where: { id: turmaId },
      });
  
      if (!registros) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }
  
      // Obter o token de acesso
      const accessToken = await obterTokenDeAcesso();
      const userId = 'eb945996-cc99-4b60-aa53-8a4f8cb286d3'; // Substitua pelo ID do usuário real
      listarTemplates(accessToken)
  
      // Dados da requisição
      const requestBody = {
        "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('educationClass')",
        "displayName": `${registros?.turmaNome} ${registros?.codigoFormatado}`,
        "description": registros?.codigoFormatado,
        "members": [
          {
            "@odata.type": "#microsoft.graph.aadUserConversationMember",
            "roles": ["owner"],
            "user@odata.bind": `https://graph.microsoft.com/v1.0/users/${userId}`
          }
        ]
      };
  
      const response = await fetch('https://graph.microsoft.com/v1.0/teams', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Resposta da API do Microsoft Graph:', data);
        res.status(200).json({ message: 'Equipe criada com sucesso!' });
      } else {
        console.error('Erro ao criar equipe:', data);
        res.status(500).json({ error: 'Erro ao criar equipe', details: data });
      }
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      res.status(500).json({ error: 'Erro ao criar equipe', details: error.message });
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

  // async migracaoService() {
  //   try {
  //     // Execute a consulta SQL para obter os dados de migração
  //     const result = await Migracao.sequelize?.query(`
  //           SELECT
  //               A.AlunoId,
  //               A.AlunoNome,
  //               A.AlunoCPF,
  //               A.AlunoEmail,
  //               T.TurmaId,
  //               T.TurmaNome,
  //               T.TurmaCodigoFormatado,
  //               T.TurmaSituacao,
  //               T.TurmaDataDeInicio,
  //               T.TurmaDataDeTermino,
  //               M.TurmaCodigoFormatado
  //           FROM
  //               [DATASET_SIG].dbo.Analise_Turma T
  //           INNER JOIN
  //               [DATASET_SIG].dbo.Analise_Matricula M ON M.TurmaId = T.TurmaId
  //           INNER JOIN
  //               [DATASET_SIG].dbo.Analise_Aluno A ON M.AlunoId = A.AlunoId
  //           WHERE
  //             T.TurmaSituacao = 'Liberada para Matrícula' OR T.TurmaSituacao = 'Em Processo'
  //       `);

  //     const todosAlunos = await Aluno.findAll({});
  //     const todasTurmas = await Turma.findAll({});


  //     for (const item of result[0]) {
  //       let turmaJaExiste = false;

  //       // Verificar se alguma turma existente tem o mesmo código
  //       for (const turma of todasTurmas) {
  //         if (turma.codigoFormatado === item['TurmaCodigoFormatado']) {
  //           turmaJaExiste = true;
  //           console.log('Turma já existe:', item['TurmaCodigoFormatado']);
  //           break; // Sair do loop assim que encontrar uma turma existente
  //         }
  //       }

  //       // Se a turma não existir, criar uma nova turma
  //       if (!turmaJaExiste) {
  //         console.log('Turma criada:', item['TurmaCodigoFormatado']);

  //         const turmaNome = item['TurmaNome'] || 'Nome Indefinido';
  //         const codigoFormatado = item['TurmaCodigoFormatado'] || 'Código Indefinido';
  //         const dataInicio = item['TurmaDataDeInicio'] || new Date().toISOString();
  //         const dataTermino = item['TurmaDataDeTermino'] || new Date().toISOString();

  //         const novaTurma = {
  //           id: uuid(),
  //           turmaNome,
  //           codigoFormatado,
  //           dataInicio,
  //           dataTermino,
  //           ativo: true,
  //           criadoNoTeams: false,
  //           fkUnidade: '7b284481-24fc-466e-97c3-300d86619425'
  //         };

  //         // Crie a nova turma no banco de dados
  //         await Turma.create(novaTurma);

  //         // Atualize a lista todasTurmas após criar a nova turma
  //         todasTurmas.push(novaTurma);
  //       }
  //     }


  //     for (const item of result[0]) {
  //       const alunoExistente = await Aluno.findOne({
  //           where: { cpf: item['AlunoCPF'] }
  //       });

  //       if (!alunoExistente) {
  //           console.log('Criando novo aluno');

  //           const nome = item['AlunoNome'] || 'Nome Indefinido';
  //           const cpf = item['AlunoCPF'] || 'Nome Indefinido';
  //           const email = this.criarEmail(nome, cpf);

  //           const novoAluno = {
  //               id: uuid(),
  //               nome,
  //               cpf,
  //               email,
  //               ativo: true,
  //               criadoNoTeams: false,
  //           };

  //           await Aluno.create(novoAluno);

  //           const alunoCriado   = await Aluno.findOne({
  //             where: { cpf} 
  //         });

  //           const turmaAtual = await Turma.findOne({
  //               where: { codigoFormatado: item['TurmaCodigoFormatado'] }
  //           });

  //           if (turmaAtual) {
  //               console.log('Turma encontrada, criando relação');

  //               // const novaTurmaAluno = {
  //               //     id: uuid(),
  //               //     fkAluno: alunoCriado?.id,
  //               //     fkTurma: turmaAtual?.id,
  //               //     criadoNoTeams : false
  //               // };

  //               await TurmaAluno.create({
  //                 id: uuid(),
  //                 fkAluno: alunoCriado?.id,
  //                 fkTurma: turmaAtual?.id,
  //                 criadoNoTeams : false


  //               });
  //           } else {
  //               console.log('Turma não encontrada');
  //           }
  //       } else {
  //           console.log('Aluno já existe');
  //       }
  //   }

  //     console.log('Dados migrados com sucesso ao iniciar a aplicação.');
  //   } catch (err) {
  //     console.error('Erro ao migrar os dados:', err);
  //     // Adicione tratamento de erro aqui conforme necessário
  //   }
  // }

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
                T.TurmaCodigoFormatado,
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
          if (turma.codigoFormatado === item['TurmaCodigoFormatado']) {
            turmaJaExiste = true;
            console.log('Turma já existe:', item['TurmaCodigoFormatado']);
            break; // Sair do loop assim que encontrar uma turma existente
          }
        }

        // Se a turma não existir, criar uma nova turma
        if (!turmaJaExiste) {
          console.log('Turma criada:', item['TurmaCodigoFormatado']);

          const turmaNome = item['TurmaNome'] || 'Nome Indefinido';
          const codigoFormatado = item['TurmaCodigoFormatado'] || 'Código Indefinido';
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

          await Aluno.create(novoAluno);

          const alunoCriado = await Aluno.findOne({
            where: { cpf }
          });


          const turmaAtual = await Turma.findOne({
            where: { codigoFormatado: item['TurmaCodigoFormatado'] }
          });


          if (turmaAtual && alunoCriado) {
            console.log('Turma encontrada, criando relação');

            // const novaTurmaAluno = {
            //     id: uuid(),
            //     fkAluno: alunoCriado.id,
            //     fkTurma: turmaAtual.id
            // };
            // console.log(turmaAtual['id'])


            await TurmaAluno.create({
              id: uuid(),
              fkAluno: alunoCriado.id,
              fkTurma: turmaAtual.id
            });
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

