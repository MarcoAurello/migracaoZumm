import { Request, Response, NextFunction } from 'express'
import Area from '../model/area.model'
import Perfil from '../model/perfil.model'
import Unidade from '../model/unidade.model'
import Usuario from '../model/usuario.model'
import { IController } from './controller.inteface'

class UsuarioController implements IController {
  async all (req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const pagina = parseInt(req.query.pagina) || 1
      const tamanho = parseInt(req.query.tamanho) || 10

      const offset = (pagina - 1) * tamanho
      const limit = tamanho

      const numeroDePaginas = Math.ceil((await Usuario.count()) / tamanho)

      const usuarios = await Usuario.findAll({
        limit,
        offset,
        include: [Perfil]
      })

      res.status(200).json({
        data: usuarios,
        paginacao: {
          pagina,
          tamanho,
          numeroDePaginas
        }
      })
    } catch (err) {
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async create (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async find (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params

      const registro = await Usuario.findOne({
        where: {
          id
        },
        include: [{
          model: Area, as: 'Area', include: [Unidade]
        },
        Perfil]
      })

      res.status(200).json({ data: registro })
    } catch (err) {
      console.log(err)
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params
      console.log(id)
      const {
        nome,
        telefone,
        chapa,
        demandante,
        fkPerfil,
        fkUnidade,
        fkArea,
        ativo,
        primeiroLogin
      } = req.body

      console.log(req.body)

      await Usuario.update({
        nome,
        telefone,
        chapa,
        demandante,
        fkPerfil,
        fkUnidade,
        fkArea,
        ativo,
        primeiroLogin
      }, {
        where: {
          id
        },
        individualHooks: false
      })

      const registro = await Usuario.findOne({ where: { id } })

      res.status(200).json({ data: registro, message: 'Alteração realizada com sucesso.' })
    } catch (err) {
      console.log(err)
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async validar (req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params
      console.log(id)
      const {
        nome,
        telefone,
        chapa,
        demandante,
        fkPerfil,
        fkUnidade,
        fkArea,
        ativo,
        primeiroLogin
      } = req.body

      await Usuario.update({
        nome,
        telefone,
        chapa,
        demandante,
        fkPerfil,
        fkUnidade,
        fkArea,
        ativo,
        primeiroLogin,
        validado: true,
        fkValidador: req.usuario.id
      }, {
        where: {
          id
        },
        individualHooks: false
      })

      const registro = await Usuario.findOne({ where: { id } })

      res.status(200).json({ data: registro, message: 'Usuário validado com sucesso.' })
    } catch (err) {
      console.log(err)
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async updatePrimeiroAcesso (req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const {
        nome,
    
        fkPerfil,

      } = req.body

      if (!nome) {
        return res.status(401).json({ message: 'O campo nome deve ser preenchido corretamente.' })
      }

    

      if (!fkPerfil) {
        return res.status(401).json({ message: 'O campo perfil deve ser preenchido corretamente.' })
      }

   

      await Usuario.update({
        nome,
      

        fkPerfil,
        
    
        primeiroLogin: false
      }, {
        where: {
          id: req.usuario.id
        },
        individualHooks: false
      })

      const registro = await Usuario.findOne({ where: { id: req.usuario.id } })

      res.status(200).json({ data: registro, message: 'Alteração realizada com sucesso.' })
    } catch (err) {
      console.log(err)
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  async delete (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async search (req: Request, res: Response, next: NextFunction): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async equipe (req: any, res: Response, next: NextFunction): Promise<any> {
    try {
      const area = await Area.findOne({ where: { id: req.usuario.fkArea } })

      const pagina = parseInt(req.query.pagina) || 1
      const tamanho = parseInt(req.query.tamanho) || 10

      const offset = (pagina - 1) * tamanho
      const limit = tamanho

      const numeroDePaginas = Math.ceil((await Usuario.count()) / tamanho)

      const registros = await Usuario.findAll({
        limit,
        offset,
        include: [Perfil, { model: Area, include: [Unidade] }],
        where: {
          '$Area.fkUnidade$': area?.fkUnidade,
          validado: true
        }
      })

      res.status(200).json({
        data: registros,
        paginacao: {
          pagina,
          tamanho,
          numeroDePaginas
        }
      })
    } catch (err) {
      console.log(err)
      res.status(401).json({ message: err.errors[0].message })
    }
  }

  // async naoValidado (req: any, res: Response, next: NextFunction): Promise<any> {
  //   try {
  //     const area = await Area.findOne({ where: { id: req.usuario.fkArea } })

  //     const pagina = parseInt(req.query.pagina) || 1
  //     const tamanho = parseInt(req.query.tamanho) || 10

  //     const offset = (pagina - 1) * tamanho
  //     const limit = tamanho

  //     const numeroDePaginas = Math.ceil((await Usuario.count({ include: [Perfil, { model: Area, include: [{ model: Unidade, where: { id: area?.fkUnidade } }] }] })) / tamanho)

  //     const registros = await Usuario.findAll({
  //       limit,
  //       offset,
  //       include: [Perfil, { model: Area, include: [Unidade] }],
  //       where: {
  //         '$Area.fkUnidade$': area?.fkUnidade,
  //         validado: false
  //       }
  //     })

  //     res.status(200).json({
  //       data: registros,
  //       paginacao: {
  //         pagina,
  //         tamanho,
  //         numeroDePaginas
  //       }
  //     })
  //   } catch (err) {
  //     console.log(err)
  //     res.status(401).json({ message: err.errors[0].message })
  //   }
  // }
}

export default new UsuarioController()
