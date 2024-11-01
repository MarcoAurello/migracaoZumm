import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Perfil from './perfil.model'
import Area from './area.model'
import TurmaAluno from './turmaaluno.model'
// import Unidade from './unidade.model'

class MembroManual extends Model { }

MembroManual.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },

  fkAluno: {
    type: DataTypes.STRING,
    allowNull:false
  },
  fkTurma: {
    type: DataTypes.STRING,
    allowNull:false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull:false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull:false
  },
  idEmailTeams: {
    type: DataTypes.STRING,
    allowNull:true
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

  
  fkUsuarioCadastrante: {
    type: DataTypes.UUID,
    allowNull: true
  }

 


}, {
  sequelize: connection,
  tableName: 'MembroManual',

})

// Turma.belongsTo(Unidade, { foreignKey: 'fkUnidade' })
// Aluno.hasMany(TurmaAluno, { foreignKey: 'fkAluno' })


export default MembroManual
