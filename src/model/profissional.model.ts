import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Teams from './teams.model'
import AlunoEmail from './alunoEmail.model'
// import Unidade from './unidade.model'

class Profissional extends Model {

}

Profissional.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },

  fkTeams: {
    type: DataTypes.UUID,
    allowNull: true
  },
  fkProfissional: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  sequelize: connection,
  tableName: 'profissional',

})

Profissional.belongsTo(Teams, { foreignKey: 'fkTeams' })
Teams.hasMany(Profissional, { foreignKey: 'fkTeams' })



export default Profissional
