import { Model, DataTypes } from 'sequelize'
import connection from './connection'

import { uuid } from 'uuidv4'
import Unidade from './unidade.model'

class Area extends Model {
  
}

Area.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'O campo nome deve ser preenchido corretamente.'
      },
      notEmpty: {
        msg: 'O campo nome deve ser preenchido corretamente.'
      }
    }
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fkUnidade: {
    type: DataTypes.UUID,
    allowNull: true,
  
  }
}, {
  sequelize: connection,
  tableName: 'area',
  hooks: {
    async beforeValidate (instance) {
      instance.id = uuid()
    }
  }
})

Area.belongsTo(Unidade, { foreignKey: 'fkUnidade' })



export default Area
