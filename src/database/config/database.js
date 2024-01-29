require('dotenv').config({ path: process.env.DEVMODE === 'test' ? '.env.test' : '.env' })

module.exports = {
  username: process.env.USER,
  password: process.env.PWD,
  database: process.env.DATABASE,
  host: process.env.SERVER,
  dialect: process.env.DIALECT
}
