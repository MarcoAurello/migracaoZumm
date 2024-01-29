import Usuario from '../../src/model/usuario.model'
import Perfil from '../../src/model/perfil.model'
import Area from '../../src/model/area.model'
import Unidade from '../../src/model/unidade.model'

describe('usuario.model', () => {
  beforeAll(async () => {
    const unidade = await Unidade.create({ nome: 'Unidade 01' })
    await Area.create({ nome: 'Area 01', fkUnidade: unidade?.id })
  })

  it('deve levantar uma exceção quando o campo email for Invalido.', async () => {
    const area = await Area.findOne()
    const perfil = await Perfil.findOne()

    const params = {
      nome: 'usuario01',
      email: 'teste',
      password: '123456',
      fkPerfil: perfil?.id,
      fkArea: area?.id
    }

    let error = ''
    await Usuario.create(params)
      .catch(err => {
        error = err.errors[0].message
      })

    expect(error).toBe('O campo email deve ser preenchido corretamente.')
  })

  it('deve levantar uma exceção quando o password for Null | Empty.', async () => {
    const area = await Area.findOne()
    const perfil = await Perfil.findOne()

    const params = {
      nome: 'usuario01',
      email: 'usuario01@pe.senac.br',
      password: '',
      fkPerfil: perfil?.id,
      fkArea: area?.id
    }

    let error = ''

    await Usuario.create(params)
      .catch(err => {
        error = err.errors[0].message
      })

    expect(error).toBe('O campo senha deve ser preenchido corretamente.')
  })

  it('deve criptografar a senha informada preenchendo o campo passwordHash.', async () => {
    const area = await Area.findOne()
    const perfil = await Perfil.findOne()

    const params = {
      nome: 'usuario01',
      email: 'usuario01@pe.senac.br',
      password: '123456',
      fkPerfil: perfil?.id,
      fkArea: area?.id
    }

    const registro = await Usuario.create(params)

    expect(registro).toHaveProperty('id')
    expect(registro.id.length).toBeGreaterThanOrEqual(36)
    expect(registro.passwordHash.length).toBeGreaterThanOrEqual(60)
  })
})
