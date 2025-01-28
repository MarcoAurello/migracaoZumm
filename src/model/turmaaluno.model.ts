import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Aluno from './aluno.model'
import Status from './status.model'
import Turma from './turma.model'
// import Unidade from './unidade.model'

class TurmaAluno extends Model {

}

TurmaAluno.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },

  fkTurma: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fkAluno: {
    type: DataTypes.STRING,
    allowNull: true
  },
  criadoNoTeams: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    
  },
 

}, {
  sequelize: connection,
  tableName: 'turmaAluno',

})


TurmaAluno.hasMany(Aluno, { foreignKey: 'fkAluno' })
Aluno.hasMany(TurmaAluno, { foreignKey: 'fkAluno' })



export default TurmaAluno
