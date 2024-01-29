/* eslint-disable promise/param-names */
import Configuracao from '../model/configuracaoGeral.model'

const nodemailer = require('nodemailer')

class Email {
  async enviar (email: string, mensagem: string): Promise<any> {
    const configuracao = await Configuracao.findOne()

    return new Promise((resolved, rejected) => {
      try {
        const transportador = nodemailer.createTransport({
          host: configuracao?.host,
          secureConnection: configuracao?.ssl,
          port: configuracao?.porta,
          auth: {
            user: configuracao?.email,
            pass: configuracao?.password
          },
          tls: { ciphers: 'SSLv3' }
        })

        const textHtml = configuracao?.template.replace('@EmailBody', mensagem)

        const opcoesEmail = {
          from: configuracao?.email,
          to: email,
          subject: 'SENAC-PE - Migraçãoc Zumm',
          html: textHtml
        }

        transportador.sendMail(opcoesEmail, (error, info) => {
          if (error) {
            rejected(error)
          } else {
            resolved('Email enviado com sucesso')
          }
        })
      } catch (err) {
        rejected(err)
      }
    })
  }
}

export default new Email()
