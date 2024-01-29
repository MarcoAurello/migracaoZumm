import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Perfil from './perfil.model'
import Area from './area.model'

class Usuario extends Model {
  public id!: string

  public nome!: string

  public email!: string

  public password!: string

  public passwordHash!: string

  public telefone!: string

  public chapa!: string

  public demandante!: Boolean

  public fkPerfil!: string

  public fkArea!: string

  public ativo!: Boolean

  public validado!: Boolean

  public primeiroLogin!: Boolean

  public fkValidador!: string

  public createdAt!: Date

  public updatedAt!: Date

  public generateToken () {
    return jwt.sign({ id: this.id }, 'c43e4311194ab5795eaf4db533b8172d')
  }
}

Usuario.init({
  id: {
    type: DataTypes.UUID,
    allowNull: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'O campo email deve ser preenchido corretamente.'
      },
      notEmpty: {
        msg: 'O campo email deve ser preenchido corretamente.'
      },
      isEmail: {
        msg: 'O campo email deve ser preenchido corretamente.'
      },
      async isUnique (value) {
        const registros = await Usuario.findAll({ where: { email: value } })
        if (registros.length > 0) {
          throw new Error('Já existe um usuário utilizando este e-mail.')
        }
      }
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.VIRTUAL,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'O campo senha deve ser preenchido corretamente.'
      },
      notEmpty: {
        msg: 'O campo senha deve ser preenchido corretamente.'
      }
    }
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  chapa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  demandante: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  primeiroLogin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  fkPerfil: {
    type: DataTypes.UUID,
    allowNull: true
  },
  fkArea: {
    type: DataTypes.UUID,
    allowNull: true
  },
  validado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  fkValidador: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  sequelize: connection,
  tableName: 'usuario',
  hooks: {
    async beforeCreate (instance) {
      instance.id = uuid()
      instance.passwordHash = await bcrypt.hash(instance.password, 8)
    }
  }
})

Usuario.belongsTo(Perfil, { foreignKey: 'fkPerfil' })
Usuario.belongsTo(Area, { foreignKey: 'fkArea' })

export default Usuario
