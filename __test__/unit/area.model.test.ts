import Unidade from '../../src/model/unidade.model'
import Area from '../../src/model/area.model'

describe('area.model', () => {
  afterAll(async () => {
    await Unidade.destroy({ truncate: true, cascade: true })
  })

  it('deve retornar um error quando o campo nome for Null | Empty.', async () => {
    const unidade = await Unidade.create({
      nome: 'Unidade 1'
    })

    const params = {
      nome: '',
      fkUnidade: unidade?.id
    }

    let error = ''

    await Area.create(params)
      .catch(err => {
        error = err.errors[0].message
      })

    expect(error).toBe('O campo nome deve ser preenchido corretamente.')
  })
})
