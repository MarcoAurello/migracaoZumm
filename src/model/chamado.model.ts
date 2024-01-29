import { Model, DataTypes } from "sequelize";
import bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import jwt from 'jsonwebtoken'

import connection from "./connection";
import Unidade from "./unidade.model";
// import Status from "./status-model";
import Usuario from "./usuario.model";

class Chamado extends Model {
  public id!: string;
  public tituloChamado!: string;
  public descricao!: string;
  public criticidade!: number;
  
  public fkUnidade!: number;
  public fkStatus!: number;
  public fkUsuario!: number;
  // public fkImagem!: string
  public flagDemandado!: boolean;
  
  public protocolo !: string;

  public createdAt!: Date
  public updatedAt!: Date

  public Usuario!: Usuario;
//   public Status!: Status;
  public Unidade!: Unidade;

 
}



Chamado.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
     
    },

    tituloChamado: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'O campo titulo deve ser preenchido corretamente.'
        },
        notEmpty: {
          msg: 'O campo titulo deve ser preenchido corretamente.'
        }
       
      }
    },

    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    criticidade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // fkImagem: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },

    fkUnidade: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        // WorkingDays hasMany Users n:n
        model: "unidade",
        key: "id",
      },
    },
    fkStatus: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        // WorkingDays hasMany Users n:n
        model: "status",
        key: "id",
      },
    },

    fkUsuario: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        // WorkingDays hasMany Users n:n
        model: "usuario",
        key: "id",
      },

      
    },

    flagDemandado :{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue : false,

    },

 
  },
  {
    sequelize: connection,
    tableName: "chamado",
    hooks: {
      async beforeValidate (instance) {
        instance.id = uuid()
      }
    }
  }
);

Chamado.belongsTo(Unidade, { foreignKey: "fkUnidade" });
// Chamado.belongsTo(Status, { foreignKey: "fkStatus" });
Chamado.belongsTo(Usuario, { foreignKey: "fkUsuario" });

//Status.sync({force: false});
export default Chamado;
