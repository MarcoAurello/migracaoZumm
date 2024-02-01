import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import connection from './connection'
import jwt from 'jsonwebtoken'
import Aluno from './aluno.model'
import Status from './status.model'
import Turma from './turma.model'
// import Unidade from './unidade.model'

class TurmaAluno extends Model {
  public id!: string;
  public fkAluno!: string;
  public fkTurma!: string;
  public criadoNoTeams!: Boolean
  public createdAt!: Date;
  public updatedAt!: Date;
  public Aluno!: Aluno;
  public Turma!: Turma;

}

TurmaAluno.init({
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },

  fkTurma: {
    type: DataTypes.UUID,
    allowNull: true
  },
  fkAluno: {
    type: DataTypes.UUID,
    allowNull: true
  },
  criadoNoTeams: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    
  },
 

}, {
  sequelize: connection,
  tableName: 'turmaAluno',

})

TurmaAluno.belongsTo(Aluno, { foreignKey: 'fkAluno' })
Aluno.hasMany(TurmaAluno, { foreignKey: 'fkAluno' })

TurmaAluno.belongsTo(Turma, { foreignKey: 'fkTurma' })
Turma.hasMany(TurmaAluno, { foreignKey: 'fkTurma' })


export default TurmaAluno
