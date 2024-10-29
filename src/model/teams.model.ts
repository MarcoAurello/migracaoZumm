import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Perfil from './perfil.model'

// import Unidade from './unidade.model'

class Teams extends Model { }

Teams.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
 
  fkTurma: {
    type: DataTypes.STRING,
    allowNull:false
  },
  idTurmaTeams: {
    type: DataTypes.STRING,
    allowNull:true
  },
  nomeEquipe: {
    type: DataTypes.STRING,
    allowNull:true
  },
  linkTurma: {
    type: DataTypes.STRING,
    allowNull:true
  },
  status: {
    type: DataTypes.STRING,
    allowNull:true
  },
 


    ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    
  },


}, {
  sequelize: connection,
  tableName: 'teams',

})

// Turma.belongsTo(Unidade, { foreignKey: 'fkUnidade' })
// Aluno.hasMany(TurmaAluno, { foreignKey: 'fkAluno' })


export default Teams
