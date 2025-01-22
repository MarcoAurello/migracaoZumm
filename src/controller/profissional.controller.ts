import { Request, Response, NextFunction } from 'express'
import { IController } from './controller.inteface'
import Profissional from '../model/profissional.model'
import emailUtils from '../utils/email.utils';
const qs = require('qs');
import sequelize from '../model/connection';
const { Op } = require('sequelize');
const axios = require('axios');

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
      id: response.data.id,
      email:response.data.userPrincipalName,
      senha:'SENAC@2024'
    };
  } catch (error) {
    console.error('Erro ao criar usuário:', error.response ? error.response.data : error.message);
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



class ProfissionalController implements IController {
  async all(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const registros = await Profissional.findAll({
        // where: {
        //     ativo: true,
        // },
        // attributes: ['fkAluno', 'nome', 'emailCriado', 'alunoVinculado', 'email']
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



  async email(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      console.log('chegou')



      // console.log("uiuiuiu" + JSON.stringify(registros))

      res.status(200).json({
        // data: registros,
        // currentPage: page, // Página atual
        // pageSize: pageSize, // Tamanho da página
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }


  }

  // async emailApi(req: Request, res: Response, next: NextFunction): Promise<any> {
  //   try {
  //     const { email, id } = req.params;  // Pegando os parâmetros da query

  //     // console.log('Email:',email)

  //     if (!email || !id) {
  //       return res.status(400).json({ message: 'Faltando parâmetros email ou id.' });
  //     } else if (email && id) {

  //       // Agora você pode fazer a lógica com o email e id aqui
  //       console.log('Emailsss:', email);
  //       console.log('IDsss:', id);


  //       const userExiste = await obterUsuarios(email)
  //       console.log('obterUsuarios:', userExiste)

  //       if (userExiste.length > 0 && userExiste[0]) {
  //         console.log('usuario Existe');
  //       } else {

  //         const [ProfessoSig] = await sequelize.query(`
  //           SELECT p.*
  //       FROM [DATASET_SIG].[dbo].[Analise_Profissional] p
        
  //   where  p.ProfissionalId = ?`,
  //           {
  //             replacements: [id]
  //           });

  //         let profissional = []


  //         if (ProfessoSig.length > 0) {
  //           profissional = ProfessoSig[0];


  //           const userExiste = await obterUsuarios(profissional.ProfissionalEmail)
  //           console.log('obterUsuario:', userExiste)
  //           res.status(200).json({
  //             message: `Usuário ja existe na base`,
  //           });

  //         } else {

  //           function getFirstAndLastName(fullName) {
  //             if (!fullName) return ''; // Retorna uma string vazia se fullName for undefined ou null
  //             const nameParts = fullName.trim().split(' '); // Divide o nome em partes
  //             const firstName = nameParts[0]; // Primeiro nome
  //             const lastName = nameParts[nameParts.length - 1]; // Último nome
  //             return firstName + lastName; // Concatena e retorna
  //           }
  //           const nomeConcatenado = await getFirstAndLastName(profissional.ProfissionalNome);

  //           if (nomeConcatenado) {

  //             const email1 = email;
  //             const mailNickname = email.split('@')[0];
  //             const senhaGerada = 'SENAC@2024';

  //             const usuarioCriado = await criarEmailInstitucional({
  //               displayName: nomeConcatenado,
  //               mailNickname,
  //               userPrincipalName: email1,
  //               password: senhaGerada
  //             });

  //             console.log('ss:', usuarioCriado)
  //           }




  //         }






  //         res.status(200).json({
  //           message: `Processando email: ${email} e ID: ${id}`,
  //         });
  //       }

  //     }



  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //     console.error(err);
  //   }
  // }


  async emailApi(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { email, id } = req.params;  // Pegando os parâmetros da query
  
      if (!email || !id) {
        return res.status(400).json({ message: 'Faltando parâmetros email ou id.' });
      }
  
      // Verifica se o usuário já existe
      const userExiste = await obterUsuarios(email);
      if (userExiste.length > 0) {
        return res.status(200).json({ message: 'Usuário já existe na base' });
      }
  
      const [ProfessoSig] = await sequelize.query(
        `SELECT p.* FROM [DATASET_SIG].[dbo].[Analise_Profissional] p WHERE p.ProfissionalId = ?`,
        { replacements: [id] }
      );
  
      if (ProfessoSig.length === 0) {
        return res.status(404).json({ message: 'Profissional não encontrado' });
      }
  
      const profissional = ProfessoSig[0];
      const userExistePorEmail = await obterUsuarios(profissional.ProfissionalEmail);
      if (userExistePorEmail.length > 0) {
        return res.status(200).json({ message: 'Usuário já existe na base com o email do profissional' });
      }
  
      // Função para obter o primeiro e último nome do profissional
      function getFirstAndLastName(fullName) {
        if (!fullName) return '';
        const nameParts = fullName.trim().split(' ');
        return nameParts[0] + nameParts[nameParts.length - 1];
      }
  
      const nomeConcatenado = getFirstAndLastName(profissional.ProfissionalNome);
      if (nomeConcatenado) {
        const email1 = email;
        const mailNickname = email.split('@')[0];
        const senhaGerada = 'SENAC@2024';
  
        const usuarioCriado = await criarEmailInstitucional({
          displayName: nomeConcatenado,
          mailNickname,
          userPrincipalName: email1,
          password: senhaGerada,
        });
  
        console.log('Usuário criado:', usuarioCriado);

        if(usuarioCriado){

          const txEmail = `
            
              <b>Provisionador de turmas Teams</b><br><br/>
              <b>Usuario Criado: </b>${email}<br><br/>
             
              
            `;

        emailUtils.enviar('marconunes@pe.senac.br', txEmail);




        }
        return res.status(200).json({ message: 'Usuário criado com sucesso' , data:usuarioCriado});
      }
  
      res.status(200).json({ message: `Processando email: ${email} e ID: ${id}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
  



  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const { id } = req.params;

      const registros = await Profissional.findOne({
        where: {
          id
        }

      });

      if (registros) {

        const txEmail = `
            
              <b>Provisionador de turmas Teams</b><br><br/>
              <b>Funcionario: </b>${registros?.nome}<br><br/>
              <b>Email: </b>${registros?.email}<br><br/>
               <b>Email do funcionário incompativel com o Microsoft Teams</b><br><br/>
               <b>Favor corrigir no Sig</b>
              
            `;

        emailUtils.enviar('marciohigo@pe.senac.br', txEmail);
      }








      console.log("uiuiuiu" + JSON.stringify(registros))

      res.status(200).json({
        // data: registros,
        // currentPage: page, // Página atual
        // pageSize: pageSize, // Tamanho da página
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error(err);
    }


  }



  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async search(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const { pesquisa } = req.query
      console.log('qqqqqqq' + pesquisa)


      const registros = await Profissional.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.like]: `%${pesquisa}%` } },
            // { cpf: { [Op.like]: `%${pesquisa}%` } },

          ]
        },

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

export default new ProfissionalController()
