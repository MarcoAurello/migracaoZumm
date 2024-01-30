import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Perfil from './perfil.model'
import Area from './area.model'
import Unidade from './unidade.model'

class Migracao extends Model {
  public AlunoId!: string
  public AlunoNome!: string
  public AlunoCPF!: string
  public AlunoEmail!: string
  public TurmaId!: string
  public TurmaNome!: string
  public CodigoDaTurma!: string
  public TurmaSituacao!: string
  public TurmaCodigoFormatado!: string

  public TurmaDataDeInicio!: Date
  public TurmaDataDeTermino!: Date



//   public telefone!: string

//   public chapa!: string

//   public demandante!: Boolean

//   public fkPerfil!: string

//   public fkArea!: string

//   public ativo!: Boolean

//   public validado!: Boolean

//   public primeiroLogin!: Boolean



  public createdAt!: Date

  public updatedAt!: Date


}

Migracao.init({
    AlunoId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  AlunoNome: {
    type: DataTypes.STRING,
    allowNull:false
  },
  AlunoCPF: {
    type: DataTypes.STRING,
    allowNull: false
  },
  AlunoEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TurmaId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TurmaNome: {
    type: DataTypes.STRING,
    allowNull: false
  },

  CodigoDaTurma: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TurmaSituacao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TurmaDataTurmaCodigoFormatadoDeTermino: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TurmaDataDeInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  TurmaDataDeTermino: {
    type: DataTypes.DATE,
    allowNull: false
  },


}, {
  sequelize: connection,
  tableName: 'migracao',

})

// Turma.belongsTo(Unidade, { foreignKey: 'fkUnidade' })
// Unidade.hasMany(Turma, { foreignKey: 'fkUnidade' })


export default Migracao
