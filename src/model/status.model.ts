import { Model, DataTypes } from 'sequelize'
import { uuid } from 'uuidv4'
import connection from './connection'

class Status extends Model {
  public id!: string


  public descricao!: string

  public createdAt!: Date

  public updatedAt!: Date
}

Status.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },

  descricao: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: connection,
  tableName: 'status',
  hooks: {
    async beforeValidate (instance) {
      instance.id = uuid()
    }
  }
})

export default Status
