import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Perfil from './perfil.model'
import Area from './area.model'
import Unidade from './unidade.model'

class Turma extends Model {
  public id!: string

  public turmaNome!: string

  public codigoFormatado!: string

  public dataInicio!: Date
  public dataTermino!: Date
  public ativo!: Boolean
  public criadoNoTeams!: Boolean

//   public telefone!: string

//   public chapa!: string

//   public demandante!: Boolean

//   public fkPerfil!: string

//   public fkArea!: string

//   public ativo!: Boolean

//   public validado!: Boolean

//   public primeiroLogin!: Boolean

  public fkUnidade!: string

  public createdAt!: Date

  public updatedAt!: Date


}

Turma.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  turmaNome: {
    type: DataTypes.STRING,
    allowNull:false
  },
  codigoFormatado: {
    type: DataTypes.STRING,
    allowNull: false
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
  fkUnidade: {
    type: DataTypes.UUID,
    allowNull: true
  },
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
  tableName: 'turma',

})

Turma.belongsTo(Unidade, { foreignKey: 'fkUnidade' })
Unidade.hasMany(Turma, { foreignKey: 'fkUnidade' })


export default Turma
