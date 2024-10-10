import { Model, DataTypes } from 'sequelize'
import { uuid } from 'uuidv4'
import connection from './connection'

class AdmTurma extends Model {

}

AdmTurma.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },

  nome: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  unidade: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: connection,
  tableName: 'admTurma',

})

export default AdmTurma
