import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'

import Unidade from './unidade.model'
import Tutor from './admTurma.model'

class Turma extends Model { }

Turma.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  idTurma: {
    type: DataTypes.STRING,
    allowNull:true
  },
  turmaNome: {
    type: DataTypes.STRING,
    allowNull:false
  },
  codigoFormatado: {
    type: DataTypes.STRING,
    allowNull: false
  },

  idTurmaTeams: {
    type: DataTypes.STRING,
    allowNull: true
  },
  linkTurma: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  unidade: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  status: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dataInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dataTermino: {
    type: DataTypes.DATE,
    allowNull: false
  },
    ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    
  },
  criadoNoTeams: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    
  },
 

  fkUnidade: {
    type: DataTypes.UUID,
    allowNull: true
  },
  fkTutor: {
    type: DataTypes.UUID,
    allowNull: true
  },

}, {
  sequelize: connection,
  tableName: 'turma',

})

Turma.belongsTo(Tutor, { foreignKey: 'fkTutor' })
Tutor.hasMany(Turma, { foreignKey: 'fkTutor' })

Turma.belongsTo(Unidade, { foreignKey: 'fkUnidade' })
Unidade.hasMany(Turma, { foreignKey: 'fkunidade' })



export default Turma
