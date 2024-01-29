import { Model, DataTypes } from 'sequelize'
import connection from './connection'

class ConfiguracaoGeral extends Model {
  public id!: string
  public autenticacaoAd!: boolean
  public email!: string
  public password!: string
  public host!: string
  public porta!: string
  public ssl!: Boolean
  public template!: string

  public urlAd!: string
  public baseDN!: string
  public usernameAd!: string
  public passwordAd!: string

  public createdAt!: Date
  public updatedAt!: Date
}

ConfiguracaoGeral.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  autenticacaoAd: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  host: {
    type: DataTypes.STRING,
    allowNull: false
  },
  porta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ssl: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  template: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  urlAd: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baseDN: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usernameAd: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordAd: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: connection,
  tableName: 'configuracaoGeral'
})

export default ConfiguracaoGeral
