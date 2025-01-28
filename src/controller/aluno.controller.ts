import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import aluno from "../model/aluno.model";
import TurmaAluno from '../model/turmaaluno.model';
import Turma from '../model/turma.model';
const dayjs = require("dayjs");

import Aluno from '../model/aluno.model';
import Erro1 from '../model/erro.model';
import emailUtils from '../utils/email.utils';
import sequelize from '../model/connection';
import { json } from 'sequelize';
import turmaalunoController from './turmaaluno.controller';
const qs = require('qs');
const { Op } = require('sequelize');
const axios = require('axios');
const { uuid } = require('uuidv4')
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



function gerarSenha() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let senha = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * caracteres.length);
    senha += caracteres[randomIndex];
  }
  return senha;
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



// async function criarEmailInstitucional({ displayName, mailNickname, userPrincipalName, password }) {
//   const token = await obterToken();
//   const endpoint = 'https://graph.microsoft.com/v1.0/users';

//   console.log('senha:' + password);

//   const body = {
//     accountEnabled: true,
//     displayName,
//     mailNickname,
//     userPrincipalName,
//     usageLocation: "BR",
//     passwordProfile: {
//       forceChangePasswordNextSignIn: true,
//       password
//     },
//     passwordPolicies: "DisablePasswordExpiration"
//   };

//   try {
//     const response = await axios.post(endpoint, body, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log('Usuário criado com sucesso:', response.data);
//     console.log('ID do usuário criado:', response.data.id);

//     await darAutorizacao(response.data.id);
//     await assignLicenseToUser(response.data.id);

//     // Retorna o ID do usuário e o log de sucesso
//     return {
//       successMessage: 'Usuário criado com sucesso',
//       id: response.data.id
//     };
//   } catch (error) {
//     console.error('Erro ao criar usuário:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }

async function criarEmailInstitucional({ displayName, mailNickname, userPrincipalName, password }) {
  const token = await obterToken();
  const endpoint = 'https://graph.microsoft.com/v1.0/users';

  console.log('senha:' + password);

  const body = {
    accountEnabled: true,
    displayName,
    mailNickname,
    userPrincipalName,
    usageLocation: "BR",
    passwordProfile: {
      forceChangePasswordNextSignIn: true,
      password
    },
    passwordPolicies: "DisablePasswordExpiration"
  };

  try {
    const response = await axios.post(endpoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Usuário criado com sucesso:', response.data);
    console.log('ID do usuário criado:', response.data.id);

    await darAutorizacao(response.data.id);
    await assignLicenseToUser(response.data.id);

    // Retorna o ID do usuário e o log de sucesso
    return {
      successMessage: 'Usuário criado com sucesso',
      id: response.data.id
    };
  } catch (error) {
    console.error('Erro ao criar usuário:', error.response ? error.response.data : error.message);
    throw error;
  }
}




async function darAutorizacao(userId) {
  console.log('iddddddddddddddddddddddddd:', userId);
  const token = await obterToken(); // Pegue o token de autenticação do Microsoft Graph
  const endpoint = `https://graph.microsoft.com/v1.0/groups/35f320fd-e29b-4cf5-86ea-d3cfb233ecb6/members/$ref`;

  const body = {
    "@odata.id": `https://graph.microsoft.com/v1.0/directoryObjects/${userId}`
  };

  try {
    const response = await axios.post(endpoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Usuário adicionado ao grupo com sucessozazaza:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar o usuário ao grupozqzqzq:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function assignLicenseToUser(userId: string) {
  // Defina o usageLocation primeiro
  await setUserUsageLocation(userId, 'BR'); // Exemplo: 'BR' para Brasil

  const token = await obterToken();
  const endpoint = `https://graph.microsoft.com/v1.0/users/${userId}/assignLicense`;

  const body = {
    "addLicenses": [
      {
        "skuId": "31d57bc7-3a05-4867-ab53-97a17835a411" // ID da licença
      }
    ],
    "removeLicenses": []
  };

  try {
    const response = await axios.post(endpoint, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Licença atribuída com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atribuir licença:', error.response ? error.response.data : error.message);
    throw error;
  }
}



async function setUserUsageLocation(userId: string, usageLocation: string) {
  const token = await obterToken();
  const endpoint = `https://graph.microsoft.com/v1.0/users/${userId}`;

  const body = {
    usageLocation: usageLocation // Defina o código do país, por exemplo "BR" ou "US"
  };

  try {
    const response = await axios.patch(endpoint, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Local de uso definido com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao definir local de uso:', error.response ? error.response.data : error.message);
    throw error;
  }
}




// async function adicionarMembroEquipe(teamId, userId) {
//   const token = await obterToken();
//   console.log('9098' + userId)

//   console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqq' + teamId + 'wwwwww' + userId)
//   const endpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/members`;

//   const membro = {
//     "@odata.type": "#microsoft.graph.aadUserConversationMember",
//     "roles": ["member"],
//     "user@odata.bind": `https://graph.microsoft.com/v1.0/users/${userId}`
//   };


//   const headers = {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   };

//   try {
//     const response = await axios.post(endpoint, membro, { headers });
//     console.log('Membro adicionado:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Erro ao adicionar membrorr:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }


// async function adicionarMembroEquipe(teamId, userId) {
//   const token = await obterToken();
//   const endpointMembros = `https://graph.microsoft.com/v1.0/teams/${teamId}/members`;

//   const headers = {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   };

//   try {
//     // Verifica os membros da equipe
//     const responseMembros = await axios.get(endpointMembros, { headers });
//     const membros = responseMembros.data.value;

//     // Verifica se o usuário já é um membro
//     const usuarioJaMembro = membros.some(membro => membro.id === userId);

//     if (usuarioJaMembro) {
//       console.log('O usuário já é membro da equipe.');
//       return;
//     }

//     // Se o usuário não for membro, adiciona
//     const membro = {
//       "@odata.type": "#microsoft.graph.aadUserConversationMember",
//       "roles": ["member"],
//       "user@odata.bind": `https://graph.microsoft.com/v1.0/users/${userId}`
//     };

//     const responseAdicionar = await axios.post(endpointMembros, membro, { headers });
//     console.log('Membro adicionado:', responseAdicionar.data);
//     return responseAdicionar.data;

//   } catch (error) {
//     console.error('Erro:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }



async function adicionarMembroEquipe(teamId, userId) {
  const token = await obterToken();
  const endpointMembros = `https://graph.microsoft.com/v1.0/teams/${teamId}/members`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log(`Verificando membros existentes para a equipe ${teamId}...`);
    const responseMembros = await axios.get(endpointMembros, { headers });
    const membros = responseMembros.data.value;

    const usuarioJaMembro = membros.some(membro => membro.id === userId);

    if (usuarioJaMembro) {
      console.log(`Usuário com ID ${userId} já é membro da equipe ${teamId}.`);
      return null;  // Retorna null se o usuário já for membro
    }

    console.log(`Usuário com ID ${userId} não é membro, iniciando processo de adição...`);
    const membro = {
      "@odata.type": "#microsoft.graph.aadUserConversationMember",
      "roles": ["member"],
      "user@odata.bind": `https://graph.microsoft.com/v1.0/users/${userId}`
    };

    const responseAdicionar = await axios.post(endpointMembros, membro, { headers });
    console.log('Membro adicionado com sucesso:', responseAdicionar.data);
    return responseAdicionar.data;

  } catch (error) {
    console.error('Erro ao adicionar membro:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function deletarEmailInstitucional(userPrincipalName) {
  if (!userPrincipalName) {
    return { error: "O parâmetro 'userPrincipalName' é obrigatório." };
  }

  const token = await obterToken();
  const endpoint = `https://graph.microsoft.com/v1.0/users/${userPrincipalName}`;

  try {
    await axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Usuário ${userPrincipalName} deletado com sucesso`);

    return {
      success: true,
      message: `Usuário ${userPrincipalName} deletado com sucesso`
    };
  } catch (error) {
    let errorMessage = "Erro desconhecido ao deletar usuário.";

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          errorMessage = "Requisição inválida. Verifique os parâmetros.";
          break;
        case 401:
          errorMessage = "Não autorizado. Verifique o token de acesso.";
          break;
        case 403:
          errorMessage = "Permissão negada. O token pode não ter permissões adequadas.";
          break;
        case 404:
          errorMessage = `Usuário ${userPrincipalName} não encontrado.`;
          break;
        case 500:
          errorMessage = "Erro interno no servidor da Microsoft.";
          break;
        default:
          errorMessage = data.error?.message || "Erro desconhecido.";
      }
    } else if (error.request) {
      errorMessage = "Sem resposta do servidor. Verifique sua conexão.";
    } else {
      errorMessage = `Erro na requisição: ${error.message}`;
    }

    console.error(`❌ ${errorMessage}`);
    return { error: errorMessage };
  }
}






class AlunoController implements IController {
  async all(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const registros = await Aluno.findAll({
        where: {
          ativo: true,
        },
        attributes: ['fkAluno', 'nome', 'emailCriado', 'alunoVinculado', 'email']
      });

      console.log("uiuiuiu" + JSON.stringify(registros))

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

  // async vincularAlunoService() {
  //   try {

  //     const alunoscomEmailSenac = await Aluno.findAll({
  //       where: {
  //         emailCriado: true,
  //         alunoVinculado: false,

  //       }
  //     });

  //     if (alunoscomEmailSenac.length > 0) {
  //       const fkAlunos = alunoscomEmailSenac.map(aluno => aluno.dataValues.fkAluno);

  //       // Passo 3: Buscar as matrículas correspondentes
  //       const matriculas = await sequelize.query(`
  //   SELECT m.*
  //   FROM [provisionadorsigteams].[dbo].[Matricula] m
  //   WHERE m.fkAluno IN (:fkAlunos) AND
  //   m.matriculaUltimaSituacao = 'Em Processo'
  // `, {
  //         replacements: { fkAlunos }, // Substituindo pelo array de fkAluno
  //         type: sequelize.QueryTypes.SELECT // Tipo de consulta SELECT
  //       });

  //       // Agora você tem as matrículas correspondentes
  //       // console.log(matriculas);

  //       console.log('para vincular:', matriculas);

  //       const turmasDetalhadas = [];

  //       for (const matricula of matriculas) {
  //         console.log('Processando matrícula:', matricula);

  //         const turma = await Turma.findOne({
  //           where: { idTurma: matricula.fkTurma } // Buscando pela fkTurma
  //         });

  //         if (turma) {
  //           console.log('Turma encontrada:', turma.idTurma);

  //           const emailsProcessados = new Set(); // Armazena emails já processados para evitar duplicação

  //           for (const aluno of alunoscomEmailSenac) {  // Itera sobre os alunos
  //             if (aluno.email && aluno.email.includes('@edu.pe.senac'
  //               && aluno.fkAluno
  //             )) {
  //               console.log('Verificando aluno:', aluno.email);

  //               // Verifica se o email já foi processado
  //               if (!emailsProcessados.has(aluno.email)) {
  //                 console.log('Email ainda não processado, adicionando:', aluno.email);

  //                 const userId = await obterUsuarios(aluno.email);
  //                 console.log('userId obtido para', aluno.email, ':', userId);

  //                 if (turma.idTurmaTeams && userId.length) {
  //                   console.log(`Adicionando membro ${userId} à turma ${turma.idTurmaTeams}`);
  //                   await delay(20000);
  //                   const migrando = await adicionarMembroEquipe(turma.idTurmaTeams, userId);

  //                   if (migrando) {
  //                     console.log('Membro adicionado com sucesso, atualizando aluno...');
  //                     await Aluno.update(

  //                       { alunoVinculado: true },
  //                       { where: { id: aluno.id } }
  //                     );

  //                     console.log('Registrando relacionamento entre Turma e Aluno...');
  //                     await TurmaAluno.create({
  //                       id: uuid(),
  //                       fkTurma: turma.idTurma || 'não encontrado',
  //                       fkAluno: aluno.fkAluno || 'nao encontrado',
  //                       criadoNoTeams: true
  //                     });

  //                     await TurmaAluno.update(

  //                       { alunoVinculado: true },
  //                       { where: { 
  //                         fkTurma: turma.idTurma,
  //                         fkAluno: aluno.fkAluno 
  //                       } }
  //                     );
  //                   }
  //                 }

  //                 // Adiciona o email ao Set para evitar duplicação
  //                 emailsProcessados.add(aluno.email);
  //                 console.log('Email adicionado ao conjunto de processados:', aluno.email);
  //               } else {
  //                 console.log('Email já processado anteriormente, ignorando:', aluno.email);
  //               }
  //             } else {
  //               console.log('Email inválido ou não autorizado:', aluno.email);
  //             }
  //           }
  //         } else {
  //           console.log('Turma não encontrada para matrícula:', matricula);
  //         }
  //       }


  //       // Agora você tem todas as turmas detalhadas
  //       // console.log('turmaddd'+JSON.stringify(turmasDetalhadas));


  //     }



  //   } catch (err) {
  //     console.error('Erro ao migrar os dados:', err);
  //   }
  // }

  // async vincularAlunoService() {
  //   try {
  //     const alunoscomEmailSenac = await Aluno.findAll({
  //       where: {
  //         emailCriado: true,
  //         alunoVinculado: false,
  //       }
  //     });

  //     if (alunoscomEmailSenac.length > 0) {
  //       const fkAlunos = alunoscomEmailSenac.map(aluno => aluno.dataValues.fkAluno);

  //       const matriculas = await sequelize.query(`
  //         SELECT m.*
  //         FROM [provisionadorsigteams].[dbo].[Matricula] m
  //         WHERE m.fkAluno IN (:fkAlunos) AND
  //         m.matriculaUltimaSituacao = 'Em Processo'
  //       `, {
  //         replacements: { fkAlunos },
  //         type: sequelize.QueryTypes.SELECT
  //       });

  //       console.log('Matrículas encontradas para vinculação:', matriculas);

  //       const emailsProcessados = new Set();

  //       for (const matricula of matriculas) {
  //         const turma = await Turma.findOne({ where: { idTurma: matricula.fkTurma } });

  //         if (turma) {
  //           console.log(`Turma encontrada para matrícula ${matricula.fkAluno}: ${turma.idTurma}`);

  //           for (const aluno of alunoscomEmailSenac) {
  //             if (aluno.email && aluno.email.includes('@edu.pe.senac') && !emailsProcessados.has(aluno.email)) {
  //               const userId = await obterUsuarios(aluno.email);
  //               console.log(`userId obtido para ${aluno.email}:`, userId);

  //               if (turma.idTurmaTeams && userId.length && aluno?.alunoVinculado === false) {
  //                 console.log(`Adicionando usuário ${userId} à equipe ${turma.idTurmaTeams}`);
  //                 await delay(20000);

  //                 const migrando = await adicionarMembroEquipe(turma.idTurmaTeams, userId);

  //                 if (migrando ) {
  //                   console.log(`Atualizando aluno ${aluno.id} como vinculado.`);
  //                   await Aluno.update({ alunoVinculado: true }, { where: { id: aluno.id } });
  //                   await Erro1.create({
  //                     id: uuid(),
  //                     aluno :    aluno?.fkAluno || 'xxxx',
  //                     descricao:'aluno vinculado no teams a turma: '+ turma?.turmaNome,
  //                     corrigido:true

  //                   })

  //                   console.log(`Registrando relação entre turma ${turma.idTurma} e aluno ${aluno.fkAluno}.`);
  //                   await TurmaAluno.update(
  //                     {
  //                       criadoNoTeams: true,
  //                     },
  //                     {
  //                       where: {
  //                         fkTurma: turma.idTurma,
  //                         fkAluno: aluno.fkAluno,
  //                       }
  //                     }
  //                   );
  //                 }

  //                 emailsProcessados.add(aluno.email);
  //               } else {
  //                 console.log(`Turma ou usuário não encontrado para ${aluno.email}`);
  //               }
  //             }
  //           }
  //         } else {
  //           console.log(`Turma não encontrada para a matrícula ${matricula.fkAluno}`);
  //         }
  //       }
  //     } else {
  //       console.log('Nenhum aluno disponível para vinculação.');
  //     }
  //   } catch (err) {
  //     console.error('Erro ao migrar os dados:', err);
  //   }
  // }






  async deletarAlunoService() {
    try {

      const dataLimite = dayjs().subtract(15, "day").toDate();

      const turmasConcluidas15dias = await Turma.findAll({
        where: {
          dataTermino: {
            [Op.lte]: dataLimite, // Menor ou igual à data de 15 dias atrás
          },
        },
      });

      const turmasIds = turmasConcluidas15dias.map(turma => turma.idTurma);



      if (turmasIds.length > 0) {
        // Busca os alunos das turmas encontradas
        const AlunosChecarEmail = await TurmaAluno.findAll({
          where: {
            fkTurma: {
              [Op.in]: turmasIds,
            },
          },
          attributes: ["fkAluno"], // Retorna apenas a coluna fkAluno
        });

        const [registro] = await sequelize.query(`
          SELECT AlunoId FROM [DATASET_SIG].[dbo].[Analise_Matricula]
          where MatriculaUltimaSituacao = 'Em Processo'
        `);

        // console.log('alunos '+ JSON.stringify(AlunosChecarEmail));
        // console.log('registros'+ JSON.stringify(registro));

        // Extrai os IDs dos alunos de cada lista
        // const alunosIds = AlunosChecarEmail.map(aluno => aluno.fkAluno);
        // const registrosIds = new Set(registro.map(reg => reg.AlunoId)); // Usando Set para otimizar a busca

        // // Filtra os alunos que NÃO estão nos registros
        // const alunosForaDosRegistros = alunosIds.filter(id => !registrosIds.has(id));

        // const resultado = alunosForaDosRegistros.map(id => ({ fkAluno: id }));

        const alunosIds = AlunosChecarEmail.map(aluno => aluno.fkAluno);
        const registrosIds = new Set(registro.map(reg => reg.AlunoId)); // Usando Set para otimizar a busca

        // Filtra os alunos que NÃO estão nos registros
        const alunosForaDosRegistros = alunosIds.filter(id => !registrosIds.has(id));

        // Cria o novo JSON no formato desejado
        const resultado = alunosForaDosRegistros.map(id => ({ fkAluno: id }));

        console.log(resultado);

        console.log('Alunos que concluiram :' + JSON.stringify(resultado));


        const idsAlunos = resultado.map(aluno => aluno.fkAluno);


        const AlunosDeletar = await Aluno.findAll({
          where: {
            fkAluno: {
              [Op.in]: idsAlunos // Filtra apenas os alunos que estão na lista
            }
          }
        });

        for (const aluno of AlunosDeletar) {
          await deletarEmailInstitucional(aluno.email)
        }



        // console.log('Alunos que concluiram e nao estão em outras tusmas:' + JSON.stringify(AlunosDeletar));


        // console.log('Alunos que concluiram e nao estão em outras tusmas:' + JSON.stringify(resultado));







      } else {
        console.log("Nenhuma turma encontrada há mais de 15 dias.");
      }



    } catch (err) {
      console.error('Erro ao migrar os dados:', err);
    }
  }

  async vincularAlunoService() {
    try {
      const alunoscomEmailSenac = await Aluno.findAll({
        where: {
          emailCriado: true,
          alunoVinculado: false,
        }
      });

      if (alunoscomEmailSenac.length > 0) {
        const fkAlunos = alunoscomEmailSenac.map(aluno => aluno.dataValues.fkAluno);

        // const matriculas = await sequelize.query(`
        //   SELECT m.*
        //   FROM [provisionadorsigteams].[dbo].[Matricula] m
        //   WHERE m.fkAluno IN (:fkAlunos) AND
        //   m.matriculaUltimaSituacao = 'Em Processo'
        // `, {
        //   replacements: { fkAlunos },
        //   type: sequelize.QueryTypes.SELECT
        // });

        const matriculas = await TurmaAluno.findAll({
          where: {
            criadoNoTeams: false
          }
        });

        console.log('Matrículas encontradas para vinculação:', matriculas);

        const emailsProcessados = new Set();

        for (const matricula of matriculas) {
          const turma = await Turma.findOne({ where: { idTurma: matricula.fkTurma } });

          if (turma) {
            console.log(`Turma encontrada para matrícula ${matricula.fkAluno}: ${turma.idTurma}`);

            for (const aluno of alunoscomEmailSenac) {
              if (aluno.email && aluno.email.includes('@edu.pe.senac') && !emailsProcessados.has(aluno.email) &&
                aluno.fkAluno === matricula.fkAluno) {
                const userId = await obterUsuarios(aluno.email);
                console.log(`userId obtido para ${aluno.email}:`, userId);

                if (turma.idTurmaTeams && userId.length && aluno?.alunoVinculado === false) {
                  console.log(`Adicionando usuário ${userId} à equipe ${turma.idTurmaTeams}`);
                  await delay(20000);

                  const migrando = await adicionarMembroEquipe(turma.idTurmaTeams, userId);

                  if (migrando) {
                    console.log(`Atualizando aluno ${aluno.id} como vinculado.`);
                    await Aluno.update({ alunoVinculado: true }, { where: { id: aluno.id } });
                    await Erro1.create({
                      id: uuid(),
                      aluno: aluno?.fkAluno || 'xxxx',
                      descricao: 'aluno vinculado no teams a turma: ' + turma?.turmaNome,
                      corrigido: true

                    })

                    console.log(`Registrando relação entre turma ${turma.idTurma} e aluno ${aluno.fkAluno}.`);
                    await TurmaAluno.update(
                      {
                        criadoNoTeams: true,
                      },
                      {
                        where: {
                          fkTurma: turma.idTurma,
                          fkAluno: aluno.fkAluno,
                        }
                      }
                    );
                  }

                  emailsProcessados.add(aluno.email);
                } else {
                  console.log(`Turma ou usuário não encontrado para ${aluno.email}`);
                }
              }
            }
          } else {
            console.log(`Turma não encontrada para a matrícula ${matricula.fkAluno}`);
          }
        }
      } else {
        console.log('Nenhum aluno disponível para vinculação.');
      }
    } catch (err) {
      console.error('Erro ao migrar os dados:', err);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }




  // async criarEmailService() {
  //   try {

  //     const alunosSemEmailSenac = await Aluno.findAll({
  //       where: {
  //         emailCriado: false,
  //         emailCadastroESenac: false
  //       }
  //     });

  //     if (alunosSemEmailSenac.length > 0) {
  //       for (const aluno of alunosSemEmailSenac) {

  //         const email = aluno.email;
  //         console.log('usuario ' + email)


  //         const userExiste = await obterUsuarios(aluno.email)
  //         console.log('usuario' + userExiste)

  //         if (userExiste.length > 0 && userExiste[0]) {
  //           console.log('usuario Existe')
  //           await Aluno.update(
  //             {
  //               emailCriado: true,
  //               idEmailTeams: userExiste?.id || 'id nao localizado'

  //             },
  //             { where: { id: aluno.id } }
  //           );

  //         } else {
  //           await delay(10000);

  //           const usuarioCriado = await criarEmailInstitucional({
  //             displayName: aluno.nome,
  //             mailNickname: email.split('@')[0],
  //             userPrincipalName: aluno.email,
  //             password: 'SENAC@2024'
  //           });

  //           if (usuarioCriado) {
  //             await Aluno.update(
  //               {
  //                 emailCriado: true,
  //                 idEmailTeams: usuarioCriado.id

  //               },
  //               { where: { id: aluno.id } }
  //             );

  //             await Erro1.create({
  //               id: uuid(),
  //               aluno :    aluno?.fkAluno ,
  //               descricao:'email institucional criado:'+ aluno.email,
  //               corrigido:true


  //             })


  //             const txEmail = `
  //               <b>Olá ${aluno.nome}.</b><br>
  //               <b>Seu email de aluno Senac PE foi criado com sucesso</b><br>
  //               Email: <strong>${email}</strong><br>
  //               Senha: <strong>${'SENAC@2024'}</strong><br>
  //               <br/>
  //               <a href="https://go.microsoft.com/fwlink/?linkid=2185828">Entrar</a>
  //               <p>
  //             `;

  //             // Enviar email
  //             // emailUtils.enviar('marconunes@pe.senac.br', txEmail);
  //           }else{
  //             await Erro1.create({
  //               id: uuid(),
  //               aluno :    aluno?.fkAluno || 'xxxx',
  //               descricao:'erro ao criar email do aluno: ' + aluno?.nome ,
  //               corrigido: false



  //             })

  //           }

  //         }


  //       }
  //     }



  //     console.log('alunos sem email institucional' + JSON.stringify(alunosSemEmailSenac))

  //   } catch (err) {

  //     console.error('Erro ao migrar os dados:', err);
  //   }
  // }

  // async  criarEmailService() {
  //   try {
  //     const alunosSemEmailSenac = await Aluno.findAll({
  //       where: {
  //         emailCriado: false,
  //         emailCadastroESenac: false
  //       }
  //     });

  //     if (alunosSemEmailSenac.length > 0) {
  //       for (const aluno of alunosSemEmailSenac) {
  //         const email = aluno.email;
  //         console.log('usuario ' + email);

  //         const userExiste = await obterUsuarios(aluno.email);
  //         console.log('usuario' + userExiste);

  //         if (userExiste.length > 0 && userExiste[0]) {
  //           console.log('usuario Existe');

  //           // Atualiza a flag emailCriado para true
  //           await Aluno.update(
  //             {
  //               emailCriado: true,
  //               idEmailTeams: userExiste[0]?.id || 'id não localizado' // Utilize o id do primeiro usuário encontrado
  //             },
  //             { where: { id: aluno.id } }
  //           );
  //         } else {
  //           await delay(10000);

  //           const testAluno = obterUsuarios(aluno.email)

  //           if(testAluno && testAluno.length > 0){
  //             console.log('ex')
  //             await Aluno.update(
  //               {
  //                 emailCriado: true,
  //                 idEmailTeams:testAluno
  //               },
  //               { where: { id: aluno.id } }
  //             );



  //           }else{
  //             console.log(' n ex' + JSON.stringify(testAluno))

  //             const usuarioCriado = await criarEmailInstitucional({
  //               displayName: aluno.nome,
  //               mailNickname: email.split('@')[0],
  //               userPrincipalName: aluno.email ,
  //               password: 'SENAC@2024'
  //             });

  //             if (usuarioCriado) {
  //               await Aluno.update(
  //                 {
  //                   emailCriado: true,
  //                   idEmailTeams: usuarioCriado.id
  //                 },
  //                 { where: { id: aluno.id } }
  //               );

  //               await Erro1.create({
  //                 id: uuid(),
  //                 aluno: aluno?.fkAluno,
  //                 descricao: 'email institucional criado: ' + aluno.email,
  //                 corrigido: true
  //               });

  //               const txEmail = `
  //                 <b>Olá ${aluno.nome}.</b><br>
  //                 <b>Seu email de aluno Senac PE foi criado com sucesso</b><br>
  //                 Email: <strong>${email}</strong><br>
  //                 Senha: <strong>${'SENAC@2024'}</strong><br>
  //                 <br/>
  //                 <a href="https://go.microsoft.com/fwlink/?linkid=2185828">Entrar</a>
  //                 <p>
  //               `;

  //               // Enviar email
  //               emailUtils.enviar(aluno?.emailCadastro, txEmail);
  //             } else {
  //               await Erro1.create({
  //                 id: uuid(),
  //                 aluno: aluno?.fkAluno || 'xxxx',
  //                 descricao: 'erro ao criar email do aluno: ' + aluno?.nome,
  //                 corrigido: false
  //               });
  //             }
  //           }


  //         }
  //       }
  //     }

  //     console.log('alunos sem email institucional: ' + JSON.stringify(alunosSemEmailSenac));

  //   } catch (err) {
  //     console.error('Erro ao migrar os dados:', err);
  //   }
  // }



  async criarEmailService() {
    try {
      const alunosSemEmailSenac = await Aluno.findAll({
        where: {
          emailCriado: false,
          emailCadastroESenac: false
        }
      });

      if (alunosSemEmailSenac.length > 0) {
        for (const aluno of alunosSemEmailSenac) {
          const email = aluno.email;
          console.log('usuario ' + email);

          const userExiste = await obterUsuarios(aluno.email);
          console.log('usuario' + userExiste);

          if (userExiste.length > 0 && userExiste[0]) {
            console.log('usuario Existe');

            // Atualiza a flag emailCriado para true
            await Aluno.update(
              {
                emailCriado: true,
                idEmailTeams: userExiste[0]?.id || 'id não localizado' // Utilize o id do primeiro usuário encontrado
              },
              { where: { id: aluno.id } }
            );
          } else {
            await delay(10000);

            const testAluno = await obterUsuarios(aluno.email); // Adicione 'await' aqui

            if (testAluno && testAluno.length > 0) {
              console.log('ex');
              await Aluno.update(
                {
                  emailCriado: true,
                  idEmailTeams: testAluno
                },
                { where: { id: aluno.id } }
              );

            } else {
              console.log(' n ex' + JSON.stringify(testAluno));

              // Verificar se o userPrincipalName já existe
              const userPrincipalName = aluno.email; // ou qualquer outra lógica que você esteja usando
              const existingUser = await obterUsuarios(userPrincipalName);

              if (existingUser.length === 0) { // Se não houver usuário existente
                try {
                  const usuarioCriado = await criarEmailInstitucional({
                    displayName: aluno.nome,
                    mailNickname: email.split('@')[0],
                    userPrincipalName: userPrincipalName,
                    password: 'SENAC@2024'
                  });

                  await Aluno.update(
                    {
                      emailCriado: true,
                      idEmailTeams: usuarioCriado.id
                    },
                    { where: { id: aluno.id } }
                  );

                  await Erro1.create({
                    id: uuid(),
                    aluno: aluno?.fkAluno,
                    descricao: 'email institucional criado: ' + aluno.email,
                    corrigido: true
                  });

                  const txEmail = `
                    <b>Olá ${aluno.nome}.</b><br>
                    <b>Seu email de aluno Senac PE foi criado com sucesso</b><br>
                    Email: <strong>${email}</strong><br>
                    Senha: <strong>${'SENAC@2024'}</strong><br>
                    <br/>
                    <a href="https://go.microsoft.com/fwlink/?linkid=2185828">Entrar</a>
                    <p>
                  `;

                  // Enviar email
                  // emailUtils.enviar(aluno?.emailCadastro, txEmail);

                } catch (error) {
                  // Verifica se o erro é do tipo que você quer tratar
                  if (error.response?.data?.error?.code === 'Request_BadRequest' &&
                    error.response?.data?.error?.message.includes('Another object with the same value for property userPrincipalName already exists.')) {
                    console.log(`Usuário já existe: ${aluno.email}`);
                    await Aluno.update(
                      {
                        emailCriado: true,
                        idEmailTeams: 'usuário já existente'
                      },
                      { where: { id: aluno.id } }
                    );
                  } else {
                    // Trate outros erros aqui se necessário
                    console.error('Erro ao criar email do aluno: ', error.response.data);
                    await Erro1.create({
                      id: uuid(),
                      aluno: aluno?.fkAluno || 'xxxx',
                      descricao: 'erro ao criar email do aluno: ' + aluno?.nome,
                      corrigido: false
                    });
                  }
                }
              } else {
                console.log(`O userPrincipalName ${userPrincipalName} já existe.`);
                // Aqui você pode optar por atualizar a flag emailCriado ou tomar alguma outra ação
                await Aluno.update(
                  {
                    emailCriado: true,
                    idEmailTeams: existingUser[0]?.id // Atualiza com o ID do usuário existente
                  },
                  { where: { id: aluno.id } }
                );
              }
            }
          }
        }
      }

      console.log('alunos sem email institucional: ' + JSON.stringify(alunosSemEmailSenac));

    } catch (err) {
      console.error('Erro ao migrar os dados:', err);
    }
  }



  // async migracaoService() {
  //   try {
  //     const turmaJaComTemas = await Turma.findAll({
  //       where: {
  //         idTurmaTeams: {
  //           [Op.not]: null
  //         }
  //       }
  //     });

  //     // Extrair os IDs das turmas
  //     const idsTurmasComTemas = turmaJaComTemas.map(turma => turma.idTurma);

  //     // Consulta para trazer os alunos das turmas que têm temas

  //     //apos o tewste filtrar os matriculados
  //     const [alunosSig] = await sequelize.query(`
  //       SELECT m.*, a.*
  //       FROM [provisionadorsigteams].[dbo].[Matricula] m
  //       JOIN [provisionadorsigteams].[dbo].[Aluno] a ON m.fkAluno = a.id
  //       WHERE m.fkTurma IN (:idsTurmas)
  //     `, {
  //       replacements: { idsTurmas: idsTurmasComTemas },
  //     });



  //     for (const aluno of alunosSig) {
  //       // Verifica se já existe um aluno com o CPF
  //       // const existingAluno = await Aluno.findOne({
  //       //    where: { cpf: aluno.cpf,

  //       //     } });


  //       const existingAluno = await TurmaAluno.findOne({

  //         where: {
  //           fkTurma: aluno.fkTurma,
  //           fkAluno: aluno.fkAluno,


  //         }

  //       })


  //       if (!existingAluno) {
  //         // Se não existir, cria um novo registro

  //         if (aluno.emailPessoal && aluno.emailPessoal.includes('edu.senac')) {
  //           await Aluno.create({
  //             id: uuid(),
  //             fkAluno: aluno.fkAluno || 'xxxx',
  //             nome: aluno.nome,
  //             cpf: aluno.cpf,
  //             email: 'gtiTeste'+aluno.emailPessoal,
  //             emailCadastro: aluno.emailPessoal || 'default@example.com',
  //             ativo: true,
  //             emailCadastroESenac: true,
  //             alunoVinculado: false,
  //             emailCriado: true,
  //             // Adicione outros campos conforme a estrutura da sua tabela
  //           });

  //           await Erro1.create({
  //             id: uuid(),
  //             aluno :   aluno?.fkAluno || 'xxxx',
  //             descricao:'Aluno criado na base:' + aluno.nome,
  //             corrigido: true


  //           })




  //         } else {

  //           await Aluno.create({
  //             id: uuid(),
  //             nome: aluno.nome,
  //             fkAluno: aluno.fkAluno || 'xxxx',
  //             cpf: aluno.cpf,
  //             email: 'gtiTeste'+aluno.emailSenac,
  //             emailCadastro: aluno.emailPessoal || 'default@example.com',
  //             ativo: true,
  //             emailCadastroESenac: false,
  //             alunoVinculado: false,
  //             emailCriado: false,
  //             // Adicione outros campos conforme a estrutura da sua tabela
  //           });
  //           await Erro1.create({
  //             id: uuid(),
  //             aluno :   aluno?.fkAluno || 'xxxx',
  //             descricao:'Aluno criado na base:' +aluno.nome ,
  //             corrigido:true

  //           })



  //         }
  //       } else {
  //         console.log(`Aluno com CPF ${aluno.cpf} já cadastrado.`);
  //         // Aqui você pode optar por atualizar o aluno existente ou ignorar
  //       }
  //     }

  //     // console.error('alunossss:', alunosSig);


  //   } catch (err) {
  //     console.error('Erro ao migrar os dados:', err);
  //   }
  // }

  async migracaoService() {
    try {
      // Buscar turmas que já têm temas vinculados
      const turmaJaComTemas = await Turma.findAll({
        where: {
          idTurmaTeams: {
            [Op.not]: null
          }
        }
      });

      console.log('Turmas já com temas:', JSON.stringify(turmaJaComTemas));

      const idsTurmasComTemas = turmaJaComTemas.map(turma => turma.idTurma);
      console.log('IDs das turmas com temas:', idsTurmasComTemas);

      // Consulta para trazer os alunos das turmas que têm temas
      const [alunosSig] = await sequelize.query(`
            SELECT m.*, a.*
        FROM [provisionadorsigteams].[dbo].[Matricula] m
        JOIN [provisionadorsigteams].[dbo].[Aluno] a ON m.fkAluno = a.id
		where  m.fkTurma IN (:idsTurmas)`, {
        replacements: { idsTurmas: idsTurmasComTemas },
      });

      console.log('Alunos recuperados:', JSON.stringify(alunosSig));

      for (const aluno of alunosSig) {
        console.log('Processando aluno:', JSON.stringify(aluno)); // Log do aluno sendo processado

        const existingAluno = await Aluno.findOne({
          where: {
            cpf: aluno?.cpf,

          }
        });
        const vinculo = await TurmaAluno.findOne({
          where: {

            fkAluno: aluno?.fkAluno,
            fkTurma: aluno?.fkTurma,

          }

        })

        if (!existingAluno && !vinculo) {
          console.log(`Aluno não encontrado, criando: ${aluno.nome}`); // Log para novo aluno

          if (aluno.emailPessoal && aluno.emailPessoal.includes('edu.senac')) {
            await Aluno.create({
              id: uuid(),
              fkAluno: aluno.fkAluno || 'xxxx',
              nome: aluno.nome,
              cpf: aluno.cpf,
              email: aluno.emailPessoal,
              emailCadastro: aluno.emailPessoal || 'default@example.com',
              ativo: true,
              emailCadastroESenac: true,
              alunoVinculado: false,
              emailCriado: true,
            });

            await TurmaAluno.create({
              id: uuid(),
              fkAluno: aluno?.fkAluno,
              fkTurma: aluno?.fkTurma,
              criadoNoTeams: false
            })

            console.log(`Aluno criado na base (edu.senac): ${aluno.nome}`);

            await Erro1.create({
              id: uuid(),
              aluno: aluno?.fkAluno || 'xxxx',
              descricao: 'Aluno criado na base: ' + aluno.nome,
              corrigido: true
            });
          } else {
            await Aluno.create({
              id: uuid(),
              nome: aluno.nome,
              fkAluno: aluno.fkAluno || 'xxxx',
              cpf: aluno.cpf,
              email: aluno.emailSenac,
              emailCadastro: aluno.emailPessoal || 'default@example.com',
              ativo: true,
              emailCadastroESenac: false,
              alunoVinculado: false,
              emailCriado: false,
            });
            await TurmaAluno.create({
              id: uuid(),
              fkAluno: aluno?.fkAluno,
              fkTurma: aluno?.fkTurma,
              criadoNoTeams: false
            })

            console.log(`Aluno criado na base (sem edu.senac): ${aluno.nome}`);

            await Erro1.create({
              id: uuid(),
              aluno: aluno?.fkAluno || 'xxxx',
              descricao: 'Aluno criado na base: ' + aluno.nome,
              corrigido: true
            });
          }
        } else {
          console.log(`Aluno com CPF ${aluno.cpf} já cadastrado.`); // Log se já existe
        }
      }

    } catch (err) {
      console.error('Erro ao migrar os dados:', err);
    }
  }






  async alunoView(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const [registro] = await sequelize.query(`
        SELECT * FROM [provisionadorsigteams].[dbo].[aluno]
      `);



      res
        .status(200)
        .json({ data: registro, message: "Vinculo Criado. " });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.errors[0].message });
    }
  }





  async vincularAllEmailInstitucional(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const { idTurma, VincularTodosEmails } = req.body;

      if (!idTurma || !Array.isArray(VincularTodosEmails) || VincularTodosEmails.length === 0) {
        return res.status(400).json({ message: "ID da Turma ou lista de emails inválida." });
      }

      const turmaAtual = await Turma.findOne({ where: { id: idTurma } });

      if (!turmaAtual) {
        return res.status(404).json({ message: "Turma não encontrada." });
      }

      const idTeamsTurma = turmaAtual?.idTurmaTeams;

      if (!idTeamsTurma) {
        return res.status(404).json({ message: "ID da turma no Teams não encontrado." });
      }

      const resultados = [];
      let alunosProcessados = 0;
      const totalAlunos = VincularTodosEmails.length;

      // Configura para manter a conexão aberta e enviar dados em "streaming"
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Transfer-Encoding', 'chunked');

      for (const email of VincularTodosEmails) {
        if (email) {
          const userId = await obterUsuarios(email);

          if (!userId) {
            resultados.push({ email, status: "Usuário não encontrado" });
            continue;
          }

          try {

            if (idTeamsTurma && userId) {

              await adicionarMembroEquipe(idTeamsTurma, userId);
              await Aluno.update({ alunoVinculado: true }, { where: { email } });
              resultados.push({ email, status: "Vinculado com sucesso" });
            }
          } catch (error) {
            resultados.push({ email, status: "Erro ao vincular aluno" });
          }

          // Atualizar progresso
          alunosProcessados++;
          const progresso = Math.floor((alunosProcessados / totalAlunos) * 100);

          // Enviar progresso parcial ao cliente
          res.write(`${JSON.stringify({ status: 'progress', progress: progresso })}\n`);
        }
      }

      // Finalizar resposta
      res.write(`${JSON.stringify({ status: 'done', message: 'Processo concluído', resultados })}\n`);
      res.end();

    } catch (err) {
      res.status(500).json({ message: 'Erro no servidor', error: err.message });
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
        where: { id: idTurma }

      });

      const idTemansTurma = turmaAtual?.idTurmaTeams

      await adicionarMembroEquipe(idTemansTurma, userId)

      await Aluno.update(
        {
          alunoVinculado: true,
        },
        {
          where: {
            email
          },
        }
      );


      const registro = []

      res
        .status(200)
        .json({ data: registro, message: "Vinculo Criado. " });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.errors[0].message });
    }
  }

  async createEmailInstitucional(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const { alunoId } = req.body;

      console.log('LOOK' + alunoId)

      if (alunoId) {
        const aluno = await Aluno.findOne({
          where: { id: alunoId }
        });

        if (!aluno) {
          return res.status(404).json({ message: 'Aluno não encontrado.' });
        }



        const email = aluno.email;
        const mailNickname = email.split('@')[0];
        const senhaGerada = gerarSenha();

        const usuarioCriado = await criarEmailInstitucional({
          displayName: aluno.nome,
          mailNickname,
          userPrincipalName: aluno.email,
          password: senhaGerada
        });






        if (usuarioCriado) {
          await Aluno.update(
            { emailCriado: true },
            { where: { id: aluno.id } }
          );

          const txEmail = `
            <b>Ola ${aluno.nome}.</b><br>
            <b>Seu email de aluno Senac PE foi criado com sucesso</b><br>
            Email: <strong>${aluno.email}</strong><br>
            Senha: <strong>${senhaGerada}</strong><br>
            <br/>
    <a href="https://go.microsoft.com/fwlink/?linkid=2185828">entrar</a><p>
          `;

          // emailUtils.enviar(aluno.emailCadastro, txEmail);
        }

      }



      res.status(200).json({ message: "Criado com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: err.message });
      res.status(500)._final
    }
  }


  async createAllEmailInstitucional(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const { CriarTodosEmails } = req.body;

      if (!CriarTodosEmails || CriarTodosEmails.length === 0) {
        return res.status(400).json({ message: "Nenhum ID fornecido." });
      }

      const totalAlunos = CriarTodosEmails.length;
      let alunosProcessados = 0;
      const resultados = [];

      // Configura para manter a conexão aberta e enviar dados em "streaming"
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Transfer-Encoding', 'chunked');

      for (const alunoId of CriarTodosEmails) {
        if (alunoId) {
          try {
            const aluno = await Aluno.findOne({ where: { id: alunoId } });

            if (!aluno) {
              resultados.push({ alunoId, status: 'Aluno não encontrado' });
              continue;
            }

            const email = aluno.email;
            const mailNickname = email.split('@')[0];
            const senhaGerada = gerarSenha();

            const usuarioCriado = await criarEmailInstitucional({
              displayName: aluno.nome,
              mailNickname,
              userPrincipalName: aluno.email,
              password: senhaGerada
            });

            if (usuarioCriado) {


              const txEmail = `
              <b>Ola ${aluno.nome}.</b><br>
              <b>Seu email de aluno Senac PE foi criado com sucesso</b><br>
              Email: <strong>${aluno.email}</strong><br>
              Senha: <strong>${senhaGerada}</strong><br>
              <br/>
      <a href="https://go.microsoft.com/fwlink/?linkid=2185828">entrar</a><p>
            `;

              // emailUtils.enviar(aluno.emailCadastro, txEmail);
              emailUtils.enviar(aluno.emailCadastro, txEmail);

              await Aluno.update({ emailCriado: true }, { where: { id: aluno.id } });
              resultados.push({ alunoId, status: 'Email criado com sucesso' });
            } else {
              resultados.push({ alunoId, status: 'Erro na criação do email' });
            }
          } catch (error) {
            resultados.push({ alunoId, status: 'Erro no processamento' });
          }

          // Atualizar progresso
          alunosProcessados++;
          const progresso = Math.floor((alunosProcessados / totalAlunos) * 100);

          // Enviar progresso parcial ao cliente
          res.write(`${JSON.stringify({ status: 'progress', progress: progresso })}\n`);
        }
      }

      // Finalizar resposta
      res.write(`${JSON.stringify({ status: 'done', message: 'Processo concluído', resultados })}\n`);
      res.end();

    } catch (err) {
      res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
  }


  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      //cpf para buscar o aluno no banco dos concluintes 
      const { id } = req.params;
      console.log('xxt' + id)
      let cpf = id.replace(/\D/g, "");

      // const config = await Config.findOne({
      //   where: { email: 'semresposta@pe.senac.br' },
      // });


      let registro = []

      // if (config?.baseProjeto) {

      //         registro = await Usuario.sequelize?.query(` select * from alunosMigrados
      // where AlunoCPF =  ?
      //       `,
      //             {
      //               replacements: [cpf]
      //             }
      //           )

      registro = await Aluno.sequelize?.query(`SELECT Top 1
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
                  M.TurmaCodigoFormatado,
                  U.UnidadeOperativaSigla Unidade
              FROM
                  [DATASET_SIG].dbo.Analise_Turma T
              INNER JOIN
                  [DATASET_SIG].dbo.Analise_Matricula M ON M.TurmaId = T.TurmaId
              INNER JOIN
                  [DATASET_SIG].dbo.Analise_Aluno A ON M.AlunoId = A.AlunoId
              INNER JOIN
                  [DATASET_SIG].dbo.Analise_RegionalUOP U ON T.UnidadeOperativaId = U.UnidadeOperativaId
              WHERE
                  (T.TurmaSituacao = 'Liberada para Matrícula' OR T.TurmaSituacao = 'Em Processo')
    and A.AlunoCPF = ?
    `,
        {
          replacements: [cpf]
        }
      )



      // }




      console.log("found" + registro)

      res.status(200).json({ data: registro });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.errors[0].message });
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
      console.log('qqqqqqq' + pesquisa)


      const registros = await Aluno.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.like]: `%${pesquisa}%` } },
            { cpf: { [Op.like]: `%${pesquisa}%` } },

          ]
        },
        // include: [
        //     {
        //         model: Unidade,  // Inclui a tabela de Unidade
        //         as: 'Unidade',  // Alias (garante que '$Unidade.nome$' funcione)
        //         include: [
        //             {
        //                 model: Area,  // Inclui a tabela de Área relacionada à Unidade
        //                 as: 'Area'  // Alias (garante que '$Unidade.Area.nome$' funcione)
        //             }
        //         ]
        //     }
        // ]
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
}

export default new AlunoController();
