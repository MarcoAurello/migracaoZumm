import Perfil from '../../src/model/perfil.model'

describe('perfil.model', () => {
  it('deve levantar uma exceção quando o campo nome for Null | Empty', async () => {
    const params = {
      nome: ''
    }

    let error = ''

    await Perfil.create(params)
      .catch(err => {
        error = err.errors[0].message
      })

    expect(error).toBe('O campo nome deve ser preenchido corretamente.')
  })
})
