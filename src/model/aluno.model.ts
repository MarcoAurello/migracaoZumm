import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Perfil from './perfil.model'
import Area from './area.model'
import TurmaAluno from './turmaaluno.model'
// import Unidade from './unidade.model'

class Aluno extends Model { }

Aluno.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },

  fkAluno: {
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
  emailDeletado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    
  },

  alunoVinculado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    
  },

    ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    
  },

 

//   telefone: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   chapa: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   demandante: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
//   },
//   ativo: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: true
//   },
//   primeiroLogin: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: true
//   },
//   fkPerfil: {
//     type: DataTypes.UUID,
//     allowNull: true
//   },
//   fkUnidade: {
//     type: DataTypes.UUID,
//     allowNull: true
//   },
//   validado: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
//   },
//   fkValidador: {
//     type: DataTypes.UUID,
//     allowNull: true
//   }
}, {
  sequelize: connection,
  tableName: 'aluno',

})

// Turma.belongsTo(Unidade, { foreignKey: 'fkUnidade' })
// Aluno.hasMany(TurmaAluno, { foreignKey: 'fkAluno' })


export default Aluno
