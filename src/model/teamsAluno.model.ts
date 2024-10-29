import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Teams from './teams.model'
import AlunoEmail from './alunoEmail.model'
// import Unidade from './unidade.model'

class TeamsAluno extends Model {

}

TeamsAluno.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },

  fkTeams: {
    type: DataTypes.UUID,
    allowNull: true
  },
  fkAlunoEmail: {
    type: DataTypes.UUID,
    allowNull: true
  }

}, {
  sequelize: connection,
  tableName: 'teamsAluno',

})

TeamsAluno.belongsTo(Teams, { foreignKey: 'fkTeams' })
Teams.hasMany(TeamsAluno, { foreignKey: 'fkTeams' })

TeamsAluno.belongsTo(AlunoEmail, { foreignKey: 'fkAlunoEmail' })
AlunoEmail.hasMany(TeamsAluno, { foreignKey: 'fkAlunoEmail' })


export default TeamsAluno
