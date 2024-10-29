import { Model, DataTypes } from 'sequelize'
import { uuid } from 'uuidv4'
import connection from './connection'

class Erro extends Model {

}

Erro.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },

  turma: {
    type: DataTypes.STRING,
    allowNull: true
  },
  aluno: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profissional: {
    type: DataTypes.STRING,
    allowNull: true
  },

  descricao: {
    type: DataTypes.STRING,
    allowNull: true
  },
  corrigido: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },

}, {
  sequelize: connection,
  tableName: 'erro',
 
})

export default Erro
