import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Aluno from './aluno.model'
import Status from './status.model'
// import Unidade from './unidade.model'

class Alunoteams extends Model {
  public id!: string
  public fkAluno!: string
  public fkStatus!: string
  public createdAt!: Date
  public updatedAt!: Date
}

Alunoteams.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },

  fkStatus: {
    type: DataTypes.UUID,
    allowNull: true
  },
  fkAluno: {
    type: DataTypes.UUID,
    allowNull: true
  }

}, {
  sequelize: connection,
  tableName: 'alunoteams',

})

Alunoteams.belongsTo(Aluno, { foreignKey: 'fkAluno' })
Alunoteams.hasMany(Status, { foreignKey: 'fkStatus' })


export default Alunoteams
