import { Model, DataTypes } from 'sequelize'
import { uuid } from 'uuidv4'
import connection from './connection'

class Perfil extends Model {
  public id!: string

  public nome!: string

  public descricao!: string

  public createdAt!: Date

  public updatedAt!: Date
}

Perfil.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'O campo nome deve ser preenchido corretamente.'
      },
      notEmpty: {
        msg: 'O campo nome deve ser preenchido corretamente.'
      }
    }
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: connection,
  tableName: 'perfil',
  hooks: {
    async beforeValidate (instance) {
      instance.id = uuid()
    }
  }
})

export default Perfil
