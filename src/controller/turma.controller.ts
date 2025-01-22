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
import Erro1 from '../model/erro.model';
import AdmTurma from '../model/admTurma.model';
import emailUtils from '../utils/email.utils';
import Area from '../model/area.model';
import Unidade from '../model/unidade.model';
import sequelize from '../model/connection';
import { JsxEmit } from 'typescript';
import { Json } from 'sequelize/lib/utils';
import Profissional from '../model/profissional.model';
import TurmaProfissional from '../model/turmaProfissional.model';
import erroController from './erro.controller';
// const { uuid } = require('uuidv4')
const { v4: uuid } = require('uuid');
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

async function adicionarMembroEquipe(teamId, userId) {
  const token = await obterToken();
  const endpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/members`;

  const membro = {
    "@odata.type": "#microsoft.graph.aadUserConversationMember",
    "roles": ["owner"],
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
    console.error('Erro ao adicionar membrorry:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function adicionarMembroEquipe1(teamId, userId,tipo) {
  const token = await obterToken();
  const endpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/members`;

  const membro = {
    "@odata.type": "#microsoft.graph.aadUserConversationMember",
    "roles": [tipo],
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
    console.error('Erro ao adicionar membrorry:', error.response ? error.response.data : error.message);
    throw error;
  }
}






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
      // const page = req.query.page ? parseInt(req.query.page as string) : 1; // Número da página
      // const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10; // Tamanho da página

      // // Cálculo do deslocamento
      // const offset = (page - 1) * pageSize;

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

        // include: [
        //   { model: TurmaAluno, include: [Aluno] },

        // ],


        // limit: pageSize, // Limite de registros por página
        // offset: offset, // Deslocamento
      });
      console.log("cdcdcd" + JSON.stringify(registros))

      res.status(200).json({
        data: registros,
        // currentPage: page, // Página atual
        // pageSize: pageSize, // Tamanho da página
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  }


  // async all (req: Request, res: Response, next: NextFunction): Promise<any> {
  //   try {
  //     const registros = await Turma.findAll({ order: [['nome', 'asc']] })

  //     res.status(200).json({ data: registros })
  //   } catch (err) {
  //     res.status(401).json({ message: err.errors[0].message })
  //   }
  // }

  

  async viewProfessores(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const [registro] = await sequelize.query(`
        SELECT * FROM [provisionadorsigteams].[dbo].[profissional]
      `);



      res
        .status(200)
        .json({ data: registro, message: "Vinculo Criado. " });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.errors[0].message });
    }
  }


  async viewTurma(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const [registro] = await sequelize.query(`
       SELECT DISTINCT [fkTurma]
FROM [ProvisionadorSigTeams].[dbo].[TurmaProfissional]

      `);

      // console.log('vbvbvb' + registro)

      res
        .status(200)
        .json({ data: registro, message: "Vinculo Criado. " });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.errors[0].message });
    }
  }






  async create (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const {
        idTurma,
        email,
        isAdmin
      } = req.body

      let tipo
      if(isAdmin === true){
        tipo = 'owner'

      }else{
        tipo = 'member'

      }

      console.log('tipo' +tipo)

      const userId = await obterUsuarios(email);
      let  membroAdicionado 
      if(userId){
        membroAdicionado = await adicionarMembroEquipe1(idTurma, userId,tipo);
            

      }


     

    //   const registro = await Unidade.create({
    //     nome,
    //     descricao
    //   })

     res.status(200).json({ data: membroAdicionado, message: 'Cadastro realizado com sucesso.' })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
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

        const txEmail = `
          
            <b>Sua nova turma no TEAMS</b><br>
           
            <br/>
    <a href="${equipe.teamLink}">Entrar na Turma</a><p>
          `;

        emailUtils.enviar(emailAdm, txEmail);

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

      registro = await Turma.findOne({ where: { idTurma: id } });

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
      const { pesquisa } = req.query;
      console.log(pesquisa);
  
      // Consulta no modelo Turma
      const turmas = await Turma.findAll({
        where: {
          [Op.or]: [
            { codigoFormatado: { [Op.like]: `%${pesquisa}%` } },
            { turmaNome: { [Op.like]: `%${pesquisa}%` } },
          ],
        },
      });
  
      // Consulta no modelo Aluno
      const alunos = await Aluno.findAll({
        where: {
          [Op.or]: [
            { fkAluno: { [Op.like]: `%${pesquisa}%` } },
          ],
        },
      });
  
      // Consulta no modelo Profissional
      const profissionais = await Profissional.findAll({
        where: {
          [Op.or]: [
            { fkProfissional: { [Op.like]: `%${pesquisa}%` } },
          ],
        },
      });
  
      // Combina os resultados das três consultas
      const registros = [
        ...turmas.map(turma => ({ ...turma.toJSON(), tipo: 'turma' })),
        ...alunos.map(aluno => ({ ...aluno.toJSON(), tipo: 'aluno' })),
        ...profissionais.map(profissional => ({ ...profissional.toJSON(), tipo: 'profissional' }))
      ];
  
      res.status(200).json({ data: registros });
    } catch (err) {
      console.log(err);
      if (typeof err.errors !== 'undefined') {
        res.status(401).json({ message: err.errors[0].message });
      } else if (typeof err.message !== 'undefined') {
        res.status(401).json({ message: err.message });
      } else {
        res.status(401).json({ message: 'Aconteceu um erro no processamento da requisição, por favor tente novamente.' });
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


 

  // async verificarProfissionalService() {
  //   try {
  //     // Buscar as turmas que não possuem Teams vinculados
  //     const turmaSemTeams = await Turma.findAll({
  //       where: { idTurmaTeams: null },

  //     });

  //     console.log('bil' + JSON.stringify(turmaSemTeams));

  //     const idsTurmasSemTeams = turmaSemTeams.map(turma => turma.idTurma);
  //     console.log('idsTurmasSemTeams' + idsTurmasSemTeams)

  //     // Realizar a consulta na tabela `TurmaProfissional` com base nos IDs obtidos
  //     if (idsTurmasSemTeams.length > 0) {
  //       const [result] = await sequelize.query(`
  //         SELECT tp.*, p.email
  //         FROM [provisionadorsigteams].[dbo].[TurmaProfissional] tp
  //         JOIN [provisionadorsigteams].[dbo].[Profissional] p
  //           ON tp.fkProfissional = p.id
  //         WHERE tp.fkTurma IN (:idsTurmasSemTeams)
  //       `, {
  //         replacements: { idsTurmasSemTeams },
  //       });

  //       console.log('result' + JSON.stringify(result))

  //       const turmasVistas = new Set();

  //       for (const item of result) {
  //         const { fkTurma, fkProfissional } = item;

  //         // Verifica se já vimos essa fkTurma
  //         if (!turmasVistas.has(fkTurma)) {
  //           // Adiciona a fkTurma ao conjunto
  //           turmasVistas.add(fkTurma);

  //           // Executa a ação de update na turma
  //           console.log(`Atualizar turma com fkTurma: ${fkTurma}`);
  //           const turmaAtual = await Turma.findOne({
  //             where: { idTurma: fkTurma }

  //           });

  //           await TurmaProfissional.create({
  //             id: uuid(),
  //             fkTurma: fkTurma,
  //             fkProfissional:fkProfissional
  //           })
  //           const token = await obterToken();
  //           const nome = turmaAtual?.turmaNome +'gtiteste';
  //           const codigo = turmaAtual?.codigoFormatado;
  //           //alterar paraprovisionadorteams@pe.senac.br
  //           const user = await obterUsuarios('provisionadorteams@pe.senac.br');
  //           if (nome && codigo && user != undefined) {
  //             const equipe = await criarEquipe1(token, nome, codigo, user);
  //             const linkTurma = equipe.teamLink
  //             if (equipe.teamId && linkTurma) {
  //               await Turma.update(
  //                 {
  //                   criadoNoTeams: true,
  //                   idTurmaTeams: equipe.teamId,
  //                   linkTurma,
  //                   status: 'turma criada no Temas'
  //                 },
  //                 { where: { idTurma: fkTurma } }
  //               );

  //               await Erro1.create({
  //                 id: uuid(),
  //                 turma :  fkTurma,
  //                 descricao:'turma Migrada para Teams: '+turmaAtual ,
  //                 corrigido:true
      
  //               })
  //             }
  //           }
  //           console.log('turma:' + JSON.stringify(turmaAtual));
  //         }
  //         console.log('email professor:' + JSON.stringify(item.email));

  //         if (item.email.includes('@pe.senac.br') || item.email.includes('@edu.pe.senac.br')) {
  //           console.log('vinculando professor:' + JSON.stringify(item.email));
  //           const userIdProf = await obterUsuarios(item.email)
  //           const turmaTemns = await Turma.findOne({
  //             where: { idTurma: fkTurma },
  //           });
  //           const idTemansTurma = turmaTemns?.idTurmaTeams

  //           if(idTemansTurma &&userIdProf ){
  //             const membroAdicionado = await adicionarMembroEquipe(idTemansTurma, userIdProf)
  //             const profissional = await Profissional.create({
  //               id: uuid(),
  //               fkTeams: turmaTemns?.id,
  //               fkProfissional: item.fkProfissional
  //             });
  //             await Erro1.create({
  //               id: uuid(),
                
  //               profissional :  item?.fkProfissional,
  //               descricao:'Profissional Vinculado:'+ item.email,
  //               corrigido:true
    
  //             })

         
  //           }


  //         } else {
  //           console.log('não vinculado professor:' + JSON.stringify(item.email));
  //           await Erro1.create({
  //             id: uuid(),
  //             profissional :  item?.fkProfissional,
  //             descricao:'Profissional não Vinculado ' + item.email,
  //             corrigido:false
            
  //           })



  //         }
  //       }

  //     }

    

  //   } catch (err) {
  //     console.error('Erro ao migrar os dados:', err);
  //   }
  // }

  async verificarProfissionalService() {
    try {
      // Buscar as turmas que não possuem Teams vinculados
      const turmaSemTeams = await Turma.findAll({
        where: { idTurmaTeams: null },
      });
  
      console.log('Turmas sem Teams:', JSON.stringify(turmaSemTeams));
  
      const idsTurmasSemTeams = turmaSemTeams.map(turma => turma.idTurma);
      console.log('IDs das turmas sem Teams:', idsTurmasSemTeams);
  
      // Realizar a consulta na tabela `TurmaProfissional` com base nos IDs obtidos
      if (idsTurmasSemTeams.length > 0) {
        // const [result] = await sequelize.query(`
        //   SELECT tp.*, p.email, p.nome
        //   FROM [provisionadorsigteams].[dbo].[TurmaProfissional] tp
        //   JOIN [provisionadorsigteams].[dbo].[Profissional] p
        //     ON tp.fkProfissional = p.id
        //   WHERE tp.fkTurma IN (:idsTurmasSemTeams)
        // `, {
        //   replacements: { idsTurmasSemTeams },
        // });

        // const [result1] = await sequelize.query(`
        //   SELECT tp.*, p.email, p.nome
        //   FROM [provisionadorsigteams].[dbo].[TurmaProfissional] tp
        //   JOIN [provisionadorsigteams].[dbo].[Profissional] p
        //     ON tp.fkProfissional = p.id
        //   WHERE tp.fkTurma IN (:idsTurmasSemTeams)
        // `, {
        //   replacements: { idsTurmasSemTeams },
        // });

        const [result] = await sequelize.query(`
          SELECT * from  [provisionadorsigteams].[dbo].[professorECoordenador]
          where fkTurma in (:idsTurmasSemTeams)`
          , {
          replacements: { idsTurmasSemTeams },
        }
      );
  
        console.log('Resultado da consultassssssssssss:', JSON.stringify(result));
  
        const turmasVistas = new Set();
  
        for (const item of result) {
          const { fkTurma, fkProfissional } = item;
  
          // Verifica se já vimos essa fkTurma
          if (!turmasVistas.has(fkTurma)) {
            // Adiciona a fkTurma ao conjunto
            turmasVistas.add(fkTurma);
  
            // Executa a ação de update na turma
            console.log(`Atualizar turma com fkTurma: ${fkTurma}`);
            const turmaAtual = await Turma.findOne({
              where: { idTurma: fkTurma }
            });
  
            await TurmaProfissional.create({
              id: uuid(),
              fkTurma: fkTurma,
              fkProfissional: fkProfissional
            });
  
            const token = await obterToken();
            const nome = turmaAtual?.codigoFormatado+''+ turmaAtual?.turmaNome ;
            const codigo = turmaAtual?.codigoFormatado;
  
            console.log(`Nome da equipe: ${nome}, Código: ${codigo}`);
  
            const user = await obterUsuarios('provisionadorteams@pe.senac.br');
            if (nome && codigo && user !== undefined) {
              const equipe = await criarEquipe1(token, nome, codigo, user);
              const linkTurma = equipe.teamLink;
  
              if (equipe.teamId && linkTurma) {
                await Turma.update(
                  {
                    criadoNoTeams: true,
                    idTurmaTeams: equipe.teamId,
                    linkTurma,
                    status: 'turma criada no Temas'
                  },
                  { where: { idTurma: fkTurma } }
                );
  
                await Erro1.create({
                  id: uuid(),
                  turma: fkTurma,
                  descricao: 'turma Migrada para Teams: ' + turmaAtual,
                  corrigido: true
                });
              }
            }
  
            console.log('Turma atualizada:', JSON.stringify(turmaAtual));
          }
  
          console.log('Email do professor:', item.email);
          let codigoTurma = ''
  
          if (item.email.includes('@pe.senac.br') || item.email.includes('@edu.pe.senac.br')) {
            console.log('Vinculando professor:', item.email);
            const userIdProf = await obterUsuarios(item.email);
            const turmaTemns = await Turma.findOne({
              where: { idTurma: fkTurma },
            });

            
            const idTemansTurma = turmaTemns?.idTurmaTeams;
  
            if (idTemansTurma && userIdProf) {
              const membroAdicionado = await adicionarMembroEquipe(idTemansTurma, userIdProf);
              const profissional = await Profissional.create({
                id: uuid(),
                fkTeams: turmaTemns?.codigoFormatado,
                fkProfissional: item?.fkProfissional,
                nome: item?.nome,
                email: item?.email,
                emailInstitucuonal : true

              });
  
              await Erro1.create({
                id: uuid(),
                profissional: item?.fkProfissional,
                descricao: 'Profissional Vinculado: ' + item.email,
                corrigido: true
              });
            }
  
          } else {
            console.log('Não vinculado professor:', item.email);

             await Profissional.create({
              id: uuid(),
              
              fkProfissional: item?.fkProfissional,
              // fkTeams: turmaTemns?.codigoFormatado,
              nome: item?.nome,
              email: item?.email,
              emailInstitucuonal : false

            });


            await Erro1.create({
              id: uuid(),
              profissional: item?.fkProfissional,
              descricao: 'Profissional não Vinculado ' + item.email,
              corrigido: false
            });
          }
        }
      }
  
    } catch (err) {
      console.error('Erro ao migrar os dados:', err);
    }
  }
  

  async migracaoService() {
    try {

      let hoje = new Date();
      hoje.setDate(hoje.getDate() + 1); // Amanhã
      const dataAmanha = hoje.toISOString().split('T')[0];
    
      const [result] = await sequelize.query(`
  SELECT t.*, u.nome AS unidadeNome
  FROM [provisionadorsigteams].[dbo].[Turma] t
  INNER JOIN [provisionadorsigteams].[dbo].[Unidade] u
  ON t.fkUnidade = u.id
  
`);
      console.log('rel' + JSON.stringify(result))


      const todosAlunos = await Aluno.findAll({});
      const todasTurmas = await Turma.findAll({});

      for (const item of result) {
        // Verificar se a unidade já existe
        let unidadeExistente = await Area.findOne({
          where: { nome: item['unidadeNome'] }
        });

        // Se a unidade não existir, criá-la
        if (!unidadeExistente) {
          console.log('Criando nova unidade:', item['unidadeNome']);

          let fk = await Unidade.findOne({
            where: { nome: 'Gerência de Tecnologia da Informação' }
          });

          unidadeExistente = await Area.create({
            id: uuid(),
            nome: item['unidadeNome'],
            descricao: null,
            fkUnidade: fk ? fk.id : 'indefinido', // Verificar se a FK existe
            ativa: true
          });
        }

        let turmaJaExiste = todasTurmas.some(turma => turma.codigoFormatado === item['codigo']);
        if (turmaJaExiste) {
          await Turma.update(
            {
              dataInicio: item['dataInicio'],
              dataTermino: item['dataTermino']
            },
            {
              where: { codigoFormatado: item['codigo'] }
            }
          );

          console.log('Turma já existe:', item['codigo']);
        } else {
          console.log('Turma criada:', item['codigo']);

          const novaTurma = {
            id: uuid(),
            turmaNome: item['nome'] || 'Nome Indefinido',
            idTurma: item['id'] || 'Nome Indefinido',
            status: 'turma não criada do Teams',
            codigoFormatado: item['codigo'] || 'Código Indefinido',
            dataInicio: item['dataInicio'] || new Date().toISOString(),
            dataTermino: item['dataTermino'] || new Date().toISOString(),
            unidade: item['unidadeNome'] || 'Nome Indefinido',
            ativo: true,
            fkUnidade: unidadeExistente.id,
            criadoNoTeams: false
          };

          await Turma.create(novaTurma);

          console.log('cadastro' +item['id'])


          await Erro1.create({
            id: uuid(),
            
            turma :  item['id'],
            descricao:'turma cadastrada:'+ item['nome'],
            corrigido:true

          })
          todasTurmas.push(novaTurma); // Atualizar a lista de turmas
        }
      }

     

      console.log('Dados migrados com sucesso ao iniciar a aplicação.');
    } catch (err) {
      console.error('Erro ao migrar os dados:', err);
      
    }
  }


}


export default new TurmaController();

