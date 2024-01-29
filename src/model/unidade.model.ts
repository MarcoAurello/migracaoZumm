import { Model, DataTypes } from 'sequelize'
import { uuid } from 'uuidv4'
import connection from './connection'

class Unidade extends Model {
  public id!: string
  public nome!: string
  public descricao!: string
  public ativa!: boolean
  public createdAt!: Date
  public updatedAt!: Date
}

Unidade.init({
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
      },
      async isUnique (value) {
        const registro = await Unidade.findAll({ where: { nome: value } })
        if (registro.length > 0) {
          throw new Error('Já existe uma unidade cadastrada com este nome.')
        }
      }
    }
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: connection,
  tableName: 'unidade',
  hooks: {
    async beforeValidate (instance) {
      instance.id = uuid()
    }
  }
})

export default Unidade
