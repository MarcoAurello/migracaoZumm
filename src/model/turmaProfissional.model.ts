import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Aluno from './aluno.model'
import Status from './status.model'
import Turma from './turma.model'
// import Unidade from './unidade.model'

class TurmaProfissional extends Model {

}

TurmaProfissional.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },

  fkTurma: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fkProfissional: {
    type: DataTypes.STRING,
    allowNull: true
  },


}, {
  sequelize: connection,
  tableName: 'turmaProfissional',

})



export default TurmaProfissional
