import request from 'supertest'
import app from '../../src/server'

jest.setTimeout(50000)

describe('statusapplication.controller', () => {
  it('deve retornar a mensagem "OK", como status 200', async () => {
    const response = await request(app)
      .get('/api/statusapplication/')
      .send()

    expect(response.status).toBe(200)
  })
})
