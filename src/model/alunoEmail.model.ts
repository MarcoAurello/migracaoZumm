import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Perfil from './perfil.model'

// import Unidade from './unidade.model'

class AlunoEmail extends Model { }

AlunoEmail.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull:false
  },
  fkAluno: {
    type: DataTypes.STRING,
    allowNull:false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },

  emailCadastro: {
    type: DataTypes.STRING,
    allowNull: true
  },

  emailCadastroESenac: {
    type: DataTypes.STRING,
    allowNull: true
  },

  emailCriado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    
  },

  alunoVinculado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    
  },

    ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    
  },


}, {
  sequelize: connection,
  tableName: 'aluno',

})

// Turma.belongsTo(Unidade, { foreignKey: 'fkUnidade' })
// Aluno.hasMany(TurmaAluno, { foreignKey: 'fkAluno' })


export default AlunoEmail
