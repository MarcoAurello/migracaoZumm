import request from 'supertest'
import app from '../../src/server'

import ConfiguracaoGeral from '../../src/model/configuracaoGeral.model'
import Unidade from '../../src/model/unidade.model'
import Area from '../../src/model/area.model'
import Perfil from '../../src/model/perfil.model'
import Usuario from '../../src/model/usuario.model'

describe('router.middleware', () => {
  beforeAll(async () => {
    const configuracao = await ConfiguracaoGeral.findOne()
    await ConfiguracaoGeral.update({
      autenticacaoAd: false
    }, {
      where: {
        id: configuracao?.id
      }
    })

    const unidade = await Unidade.create({ nome: 'GTI - Gerência de Tecnologia da Informação' })
    const area = await Area.create({ nome: 'Sistemas', fkUnidade: unidade.id })

    const perfil = await Perfil.findOne({ where: { nome: 'Funcionário' } })
    await Usuario.create({
      nome: 'Administrador',
      email: 'administrador@pe.senac.br',
      password: '123456',
      telefone: '2053',
      chapa: '15385-F1',
      demandante: true,
      fkPerfil: perfil?.id,
      fkArea: area.id,
      validado: true
    })
  })

  it('deve retornar uma mensagem de error, quando não for informado um token valido.', async () => {
    const response = await request(app).get('/api/usuario/')
      .send()

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Token not provided.')
  })

  it('deve retornar o status 200 quando for informado um token válido.', async () => {
    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'administrador@pe.senac.br', password: '123456' })

    expect(response.body).toHaveProperty('token')

    const response2 = await request(app)
      .get('/api/unidade/')
      .set('authorization', `Bearer ${response.body.token}`)
      .send()

    expect(response2.status).toBe(200)
  })

  it('deve retornar o status 401 quando o usuário não tiver permissão para acessar a rota.', async () => {
    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'administrador@pe.senac.br', password: '123456' })

    expect(response.body).toHaveProperty('token')

    const response2 = await request(app)
      .get('/api/usuario/')
      .set('authorization', `Bearer ${response.body.token}`)
      .send()

    expect(response2.status).toBe(401)
  })
})
