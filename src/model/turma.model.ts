import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'

import Unidade from './unidade.model'

class Turma extends Model {
  public id!: string

  public turmaNome!: string

  public codigoFormatado!: string

  public dataInicio!: Date
  public dataTermino!: Date
  public ativo!: Boolean
  public criadoNoTeams!: Boolean
  public linkTurma!: string
  public fkUnidade!: string
  public createdAt!: Date
  public updatedAt!: Date
  public Unidade!: Unidade

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
  linkTurma: {
    type: DataTypes.STRING,
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

}, {
  sequelize: connection,
  tableName: 'turma',

})

// Turma.belongsTo(Unidade, { foreignKey: 'fkUnidade' })
// Unidade.hasMany(Turma, { foreignKey: 'fkUnidade' })


export default Turma
