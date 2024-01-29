import Unidade from '../../src/model/unidade.model'

describe('unidade.model', () => {
  beforeEach(async () => {
    await Unidade.destroy({ truncate: true, cascade: true })
  })

  afterAll(async () => {
    await Unidade.destroy({ truncate: true, cascade: true })
  })

  it('deve retornar um error quando o campo nome for Null | Empty', async () => {
    const params = {
      nome: ''
    }

    let error = ''

    await Unidade.create(params)
      .catch(err => {
        error = err.errors[0].message
      })

    expect(error).toBe('O campo nome deve ser preenchido corretamente.')
  })

  it('deve retornar o registro cadastrado com sucesso', async () => {
    const params = {
      nome: 'Unidade 1'
    }

    const registro = await Unidade.create(params)

    expect(registro).toHaveProperty('id')
    expect(registro.id.length).toBeGreaterThanOrEqual(36)
  })

  it('deve retornar um error quando já existir uma unidade com o mesmo nome', async () => {
    const params = {
      nome: 'Unidade 2'
    }

    const registro1 = await Unidade.create(params)
      .catch(err => {
        console.log(err)
      })

    expect(registro1).toHaveProperty('id')
    expect(registro1?.id.length).toBeGreaterThanOrEqual(36)

    let error = ''
    await Unidade.create(params)
      .catch(err => {
        error = err.errors[0].message
      })

    expect(error).toBe('Já existe uma unidade cadastrada com este nome.')
  })
})
