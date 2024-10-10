import { IController } from './controller.inteface'
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

import { Request, Response, NextFunction, response } from "express";
import Migracao from "../model/migracao.model";
import Turma from "../model/turma.model";
import Aluno from "../model/aluno.model";
import TurmaAluno from '../model/turmaaluno.model';
const qs = require('qs');
const axios = require('axios');
import turmaalunoController from './turmaaluno.controller';
import admTurmaController from './admTurma.controller';
import AdmTurma from '../model/admTurma.model';
const { uuid } = require('uuidv4')
const getAccessToken = require('../utils/authConfig');
const { Client } = require('@microsoft/microsoft-graph-client');




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




// async function criarEquipe1(token, nome, codigo, user) {


//   // Defina o corpo da solicitação
//   const equipe = {
//     "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('educationClass')",
//     "displayName": nome + codigo,
//     "description": codigo,
//     "members": [
//       {
//         "@odata.type": "#microsoft.graph.aadUserConversationMember",
//         "roles": [
//           "owner"
//         ],
//         "user@odata.bind": `https://graph.microsoft.com/v1.0/users/${user}`
//       }
//     ]
//   };

//   // Defina os cabeçalhos da solicitação
//   const headers = {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   };

//   try {
//     // Envie a solicitação POST para criar a equipe
//     const response = await axios.post('https://graph.microsoft.com/v1.0/teams', equipe, { headers });
//     console.log('Equipe criada:', response.data);

//     const contentLocation = response.headers['content-location'];
//     const match = contentLocation.match(/\/teams\('([^']+)'\)/);
//     const teamId = match ? match[1] : null;
//     console.log('Team ID:', teamId);


//     return { data: response.data, teamId };

//     return response.data;
//   } catch (error) {
//     console.error('Erro ao criar equipe:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }


async function criarEquipe1(token, nome, codigo, user) {
  // Defina o corpo da solicitação
  const equipe = {
    "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates('educationClass')",
    "displayName": nome + codigo,
    "description": codigo,
    "members": [
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        "roles": ["owner"],
        "user@odata.bind": `https://graph.microsoft.com/v1.0/users/${user}`
      }
    ]
  };

  // Defina os cabeçalhos da solicitação
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Envie a solicitação POST para criar a equipe
    const response = await axios.post('https://graph.microsoft.com/v1.0/teams', equipe, { headers });
    console.log('Equipe criada:', response.data);

    const contentLocation = response.headers['content-location'];
    const match = contentLocation.match(/\/teams\('([^']+)'\)/);
    const teamId = match ? match[1] : null;
    console.log('Team ID:', teamId);

    if (teamId) {
      // Agora obtenha o link de participação da equipe
      const channelResponse = await axios.get(`https://graph.microsoft.com/v1.0/teams/${teamId}/channels/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const generalChannel = channelResponse.data.value.find(channel => channel.displayName === 'General' || channel.displayName === 'Geral');
      if (generalChannel) {
        const teamLink = generalChannel.webUrl;
        console.log('Link da sala (canal geral):', teamLink);

        // Retorne os dados da equipe e o link
        return { data: response.data, teamId, teamLink };
      } else {
        throw new Error('Canal "Geral" não encontrado.');
      }
    } else {
      throw new Error('Erro ao extrair o ID da equipe.');
    }

  } catch (error) {
    console.error('Erro ao criar equipe:', error.response ? error.response.data : error.message);
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



  async criarEquipe(req, res, next) {
    try {
      const token = await obterToken();
      const { turmaId } = req.params;

      const { emailAdm } = req.body;


      const turmaAtual = await Turma.findOne({
        where: { id: turmaId }

      });

      const nome = turmaAtual?.turmaNome
      const codigo = turmaAtual?.codigoFormatado
      // console.log(nome)
      // console.log(codigo)
      // console.log(emailAdm)

      const user = await obterUsuarios(emailAdm)
      console.log('aaa' + user)



      if (nome && codigo && user != undefined) {

         const equipe = await criarEquipe1(token, nome, codigo, user);

        // const { data, teamId, teamLink } = await criarEquipe1(token, nome, codigo, user);


        console.log("Equipe criada:", equipe.teamLink);

        const linkTurma = equipe.teamLink

        const tutor = await AdmTurma.findOne({
          where: { email: emailAdm }
  
        });
  

        if (equipe.teamId && linkTurma) {
         
          await Turma.update(
            {
              criadoNoTeams: true,
              idTurmaTeams: equipe.teamId,
              linkTurma,
              fkTutor: tutor?.id,
            },
            { where: { id: turmaAtual.id } }
          );
        }
        res.status(200).json({ equipe });
      }



    } catch (error) {
      console.error("Erro ao criar grupo ou equipe:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
  
      let registro = null; // Initialize as null
  
      registro = await Turma.findOne({ where: { id } });
  
      console.log('235' + JSON.stringify(registro));
  
      // Check if registro is null
      if (!registro) {
        registro = await Turma.findAll({
          where: { fkTutor: id },
        });
      }
  
      console.log('632' + JSON.stringify(registro));
  
      res.status(200).json({ data: registro });
    } catch (err) {
      // Improved error handling
      const message = err.errors && err.errors.length > 0
        ? err.errors[0].message
        : 'An error occurred';
      
      res.status(401).json({ message });
    }
  }
  
  

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async search(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const { pesquisa } = req.query
      console.log(pesquisa)


      const registros = await Turma.findAll({
        where: {
          [Op.or]: [
            { turmaNome: { [Op.like]: `%${pesquisa}%` } },
            { codigoFormatado: { [Op.like]: `%${pesquisa}%` } }
          ]
        }
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
    const email = `${primeiroNomeSemAcentos.toLowerCase()}${ultimoNomeSemAcentos.toLowerCase()}${cpfFormatado}testeGTI@edu.pe.senac.br`;

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
                T.TurmaAdiada,
                M.TurmaCodigoFormatado
            FROM
                [DATASET_SIG].dbo.Analise_Turma T
            INNER JOIN
                [DATASET_SIG].dbo.Analise_Matricula M ON M.TurmaId = T.TurmaId
            INNER JOIN
                [DATASET_SIG].dbo.Analise_Aluno A ON M.AlunoId = A.AlunoId
            WHERE
              (T.TurmaSituacao = 'Liberada para Matrícula' OR T.TurmaSituacao = 'Em Processo')
               
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


          let novoAluno;

          if (item['AlunoEmail'] && item['AlunoEmail'].includes('@edu.pe.senac.br')) {
            novoAluno = {
              id: uuid(),
              nome,
              cpf,
              email: item['AlunoEmail'],
              // emailCadastro: item['AlunoEmail'],
              emailCadastro: 'marconunes@pe.senac.br',
              emailCriado: true,  // Se o e-mail tiver o domínio, marca como criado
              emailCadastroESenac: true,
              ativo: true,
              criadoNoTeams: false,
              alunoVinculado: false
            };
          } else {
            novoAluno = {
              id: uuid(),
              nome,
              cpf,
              email,
              // emailCadastro: item['AlunoEmail'] || '', 
              emailCadastro: 'marconunes@pe.senac.br',
              emailCriado: false,  // Se não tiver o domínio, marca como não criado
              emailCadastroESenac: false,
              ativo: true,
              criadoNoTeams: false,
              alunoVinculado: false
            };
          }


          // const novoAluno = {
          //   id: uuid(),
          //   nome,
          //   cpf,
          //   email,
          //   emailCadastro : item['AlunoEmail'],
          //   emailCriado:false,
          //   ativo: true,
          //   criadoNoTeams: false,
          //   alunoVinculado:false
          // };

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

