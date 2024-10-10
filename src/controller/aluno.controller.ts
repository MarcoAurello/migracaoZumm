import { IController } from './controller.inteface'
import { Request, Response, NextFunction } from "express";
import aluno from "../model/aluno.model";
import TurmaAluno from '../model/turmaaluno.model';
import Turma from '../model/turma.model';
import Aluno from '../model/aluno.model';
import emailUtils from '../utils/email.utils';
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
  console.log('xxee' + variavelEmail)
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

async function criarEmailInstitucional({ displayName, mailNickname, userPrincipalName, password }) {
  const token = await obterToken();
  const endpoint = 'https://graph.microsoft.com/v1.0/users';
  const pass = 'D@v!M!guel2017'
  console.log('senha:' + password)

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
    console.log('ccccccccccccccccccc' + JSON.stringify(response.data.id))

    await darAutorizacao(response.data.id)
    await assignLicenseToUser(response.data.id)

    // atribuirLicenca(response.data.id, '31d57bc7-3a05-4867-ab53-97a17835a411')
    return response.data;
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




async function adicionarMembroEquipe(teamId, userId) {
  const token = await obterToken();
  const endpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/members`;

  const membro = {
    "@odata.type": "#microsoft.graph.aadUserConversationMember",
    "roles": ["member"],
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
    console.error('Erro ao adicionar membrorr:', error.response ? error.response.data : error.message);
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



  async vincularAllEmailInstitucional(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const { idTurma, VincularTodosEmails } = req.body;

      // Verifica se idTurma e VincularTodosEmails são válidos
      if (!idTurma || !Array.isArray(VincularTodosEmails) || VincularTodosEmails.length === 0) {
        return res.status(400).json({ message: "ID da Turma ou lista de emails inválida." });
      }

      const turmaAtual = await Turma.findOne({
        where: { id: idTurma }
      });

      if (!turmaAtual) {
        return res.status(404).json({ message: "Turma não encontrada." });
      }

      const idTeamsTurma = turmaAtual?.idTurmaTeams;

      if (!idTeamsTurma) {
        return res.status(404).json({ message: "ID da turma no Teams não encontrado." });
      }

      const resultados = [];

      // Itera sobre a lista de emails para vincular os alunos à turma
      for (const email of VincularTodosEmails) {
        if (email) {
          const userId = await obterUsuarios(email);

          if (!userId) {
            console.error(`Usuário com email ${email} não encontrado no sistema.`);
            resultados.push({ email, status: "Usuário não encontrado" });
            continue;
          }

          try {
            // Adiciona o aluno à turma no Teams
            await adicionarMembroEquipe(idTeamsTurma, userId);

            // Atualiza o status do aluno como vinculado
            await Aluno.update(
              { alunoVinculado: true },
              { where: { email } }
            );

            resultados.push({ email, status: "Vinculado com sucesso" });
          } catch (error) {
            console.error(`Erro ao vincular o email ${email}:`, error);
            resultados.push({ email, status: "Erro ao vincular aluno" });
          }
        }
      }

      // Retorna a lista de resultados para o frontend
      console.log(resultados); // Feedback no console do servidor
      res.status(200).json({ message: "Processo de vinculação concluído", resultados });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Erro no servidor", error: err.message });
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

          emailUtils.enviar(aluno.emailCadastro, txEmail);
        }

      }

      // else if (CriarTodosEmails.length > 0 &&  !alunoId) {
      //   for (const alunoId of CriarTodosEmails) {
      //     if (alunoId) {
      //       const aluno = await Aluno.findOne({
      //         where: { id: alunoId }
      //       });

      //       if (!aluno) {
      //         console.error(`Aluno com ID ${alunoId} não encontrado.`);
      //         continue;
      //       }

      //       const email = aluno.email;
      //       const mailNickname = email.split('@')[0];
      //       const senhaGerada = gerarSenha();

      //       const usuarioCriado = await criarEmailInstitucional({
      //         displayName: aluno.nome,
      //         mailNickname,
      //         userPrincipalName: aluno.email,
      //         password: senhaGerada
      //       });

      //       if (usuarioCriado) {
      //         await Aluno.update(
      //           { emailCriado: true },
      //           { where: { id: aluno.id } }
      //         );

      //         const txEmail = `
      //           <b>Email Senac Criado.</b><br>
      //           Email: <strong>${aluno.email}</strong><br>
      //           Senha: <strong>${senhaGerada}</strong><br>
      //         `;

      //         emailUtils.enviar(aluno.emailCadastro, txEmail);
      //       }
      //     }
      //   }
      // }

      res.status(200).json({ message: "Criado com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: err.message });
    }
  }

  // async createAllEmailInstitucional(req: any, res: Response, next: NextFunction): Promise<any> {
  //   try {
  //     const { CriarTodosEmails } = req.body;

  //     if (!CriarTodosEmails || CriarTodosEmails.length === 0) {
  //       return res.status(400).json({ message: "Nenhum ID fornecido." });
  //     }

  //     const resultados = [];

  //     for (const alunoId of CriarTodosEmails) {
  //       if (alunoId) {
  //         try {
  //           const aluno = await Aluno.findOne({ where: { id: alunoId } });

  //           if (!aluno) {
  //             console.error(`Aluno com ID ${alunoId} não encontrado.`);
  //             resultados.push({ alunoId, status: 'Aluno não encontrado' });
  //             continue; // Skip to the next alunoId
  //           }

  //           const email = aluno.email;
  //           const mailNickname = email.split('@')[0];
  //           const senhaGerada = gerarSenha();

  //           const usuarioCriado = await criarEmailInstitucional({
  //             displayName: aluno.nome,
  //             mailNickname,
  //             userPrincipalName: aluno.email,
  //             password: senhaGerada
  //           });

  //           if (usuarioCriado) {
  //             await Aluno.update({ emailCriado: true }, { where: { id: aluno.id } });

  //             const txEmail = `
  //                           <b>Email Senac Criado.</b><br>
  //                           Email: <strong>${aluno.email}</strong><br>
  //                           Senha: <strong>${senhaGerada}</strong><br>
  //                       `;
  //             emailUtils.enviar(aluno.emailCadastro, txEmail);

  //             resultados.push({ alunoId, status: 'Email criado com sucesso' });
  //           } else {
  //             resultados.push({ alunoId, status: 'Erro na criação do email' });
  //           }
  //         } catch (error) {
  //           console.error(`Erro ao processar aluno ID ${alunoId}:`, error);
  //           resultados.push({ alunoId, status: 'Erro no processamento' });
  //         }
  //       }
  //     }

  //     console.log(resultados); // Log no console do servidor
  //     res.status(200).json({ message: "Processo concluído", resultados });

  //   } catch (err) {
  //     console.error('Erro no servidor:', err);
  //     res.status(500).json({ message: 'Erro no servidor', error: err.message });
  //   }
  // }

  async createAllEmailInstitucional(req: any, res: Response): Promise<any> {
    try {
      const { CriarTodosEmails } = req.body;
  
      if (!CriarTodosEmails || CriarTodosEmails.length === 0) {
        return res.status(400).json({ message: "Nenhum ID fornecido." });
      }
  
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
  
      const totalEmails = CriarTodosEmails.length;
      let processedEmails = 0;
      const resultados = [];
  
      for (const alunoId of CriarTodosEmails) {
        if (alunoId) {
          try {
            const aluno = await Aluno.findOne({ where: { id: alunoId } });
  
            if (!aluno) {
              resultados.push({ alunoId, status: 'Aluno não encontrado' });
              continue;
            }
  
            const senhaGerada = gerarSenha();
            const usuarioCriado = await criarEmailInstitucional({
              displayName: aluno.nome,
              mailNickname: aluno.email.split('@')[0],
              userPrincipalName: aluno.email,
              password: senhaGerada
            });
  
            if (usuarioCriado) {
              await Aluno.update({ emailCriado: true }, { where: { id: aluno.id } });
              emailUtils.enviar(aluno.emailCadastro, `Email criado: ${aluno.email}`);
              resultados.push({ alunoId, status: 'Email criado com sucesso' });
            } else {
              resultados.push({ alunoId, status: 'Erro na criação do email' });
            }
          } catch (error) {
            resultados.push({ alunoId, status: 'Erro no processamento' });
          }
  
          processedEmails++;
          const progress = Math.floor((processedEmails / totalEmails) * 100);
  
          // Enviar atualização de progresso para o frontend
          res.write(`data: ${JSON.stringify({ progress })}\n\n`);
        }
      }
  
      // Enviar mensagem final quando o processo for concluído
      res.write(`data: ${JSON.stringify({ message: "Processo concluído", resultados })}\n\n`);
      res.end();
    } catch (err) {
      console.error('Erro no servidor:', err);
      res.status(500).json({ message: 'Erro no servidor', error: err.message });
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
