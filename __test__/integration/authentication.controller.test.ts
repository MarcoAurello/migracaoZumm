import app from '../../src/server'
import request from 'supertest'
import Usuario from '../../src/model/usuario.model'
import ConfiguracaoGlobal from '../../src/model/configuracaoGeral.model'

describe('authentication.controller', () => {
  it('deve levantar uma exceção quando campo email for Null | Empty', async () => {
    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: '', password: '123456789' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('O campo e-mail deve ser preenchido corretamente.')
  })

  it('deve levantar uma exceção quando campo password for Null | Empty', async () => {
    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'diegoalisson@pe.senac.br', password: '' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('O campo senha deve ser preenchido corretamente.')
  })

  it('deve levantar uma exceção quando o login ou senha forem inválidados pelo ActivityDirectory', async () => {
    const configuracao = await ConfiguracaoGlobal.findOne()
    await ConfiguracaoGlobal.update({ autenticacaoAd: true }, { where: { id: configuracao?.id } })
    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'diegoalisson@pe.senac.br', password: '123456789' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Login ou senha inválidos.')
  })

  it('deve retornar uma mensagem de sucesso quando o usuário for validado por o ActivityDirectory', async () => {
    const configuracao = await ConfiguracaoGlobal.findOne()
    await ConfiguracaoGlobal.update({ autenticacaoAd: true }, { where: { id: configuracao?.id } })
    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'diegoalisson@pe.senac.br', password: 'gti@2021' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Usuário validado com sucesso.')
  })

  it('deverá criar um novo usuário quando for o primeiro acesso de autenticação via ActivityDirectory', async () => {
    const configuracao = await ConfiguracaoGlobal.findOne()
    await ConfiguracaoGlobal.update({ autenticacaoAd: true }, { where: { id: configuracao?.id } })
    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'diegoalisson@pe.senac.br', password: 'gti@2021' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Usuário validado com sucesso.')

    const registro = await Usuario.findOne({ where: { email: 'diegoalisson@pe.senac.br' } })
    expect(registro).toHaveProperty('id')
    expect(registro?.id.length).toBeGreaterThanOrEqual(36)
  })

  it('deve retornar um JWT Token quando o usuário for validado por o ActivityDirectory', async () => {
    const configuracao = await ConfiguracaoGlobal.findOne()
    await ConfiguracaoGlobal.update({ autenticacaoAd: true }, { where: { id: configuracao?.id } })
    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'diegoalisson@pe.senac.br', password: 'gti@2021' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Usuário validado com sucesso.')
    expect(response.body).toHaveProperty('token')
    expect(response.body.token.length).toBeGreaterThanOrEqual(60)
  })

  it('deve retornar o status 200 com as informações do usuário logado', async () => {
    const configuracao = await ConfiguracaoGlobal.findOne()
    await ConfiguracaoGlobal.update({ autenticacaoAd: true }, { where: { id: configuracao?.id } })
    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'diegoalisson@pe.senac.br', password: 'gti@2021' })

    const { token } = response.body

    const response2 = await request(app)
      .get('/api/authentication/logged')
      .set('authorization', `Bearer ${token}`)
      .send()

    expect(response2.status).toBe(200)
    expect(response2.body.data).toHaveProperty('nome')
    expect(response2.body.data).toHaveProperty('email')
    expect(response2.body.data).toHaveProperty('Perfil')
  })

  it('deve retornar o status 401 quando o email for invalidado localmente', async () => {
    const configuracao = await ConfiguracaoGlobal.findOne()
    await ConfiguracaoGlobal.update({ autenticacaoAd: false }, { where: { id: configuracao?.id } })

    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'teste@pe.senac.br', password: 'gti@2021' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Não foi possível localizar o usuário.')
  })

  it('deve retornar o status 401 quando a senha for invalidada localmente', async () => {
    const configuracao = await ConfiguracaoGlobal.findOne()
    await ConfiguracaoGlobal.update({ autenticacaoAd: false }, { where: { id: configuracao?.id } })

    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'diegoalisson@pe.senac.br', password: '123456' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Senha inválida.')
  })

  it('deve retornar um JWT Token quando o usuário for validado localmente', async () => {
    const configuracao = await ConfiguracaoGlobal.findOne()
    await ConfiguracaoGlobal.update({ autenticacaoAd: false }, { where: { id: configuracao?.id } })

    const response = await request(app)
      .post('/api/authentication/')
      .send({ email: 'diegoalisson@pe.senac.br', password: 'gti@2021' })

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Usuário validado com sucesso.')
    expect(response.body).toHaveProperty('token')
    expect(response.body.token.length).toBeGreaterThanOrEqual(60)
  })
})
