'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('aluno', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      fkAluno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: true
      },
      
      idEmailTeams: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emailCadastro: {
        type: Sequelize.STRING,
        allowNull: true,

      },
  
      emailDeletado: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      emailCriado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },

      

      emailCadastroESenac: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },


      alunoVinculado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
 
 

      // fkUnidade: {
      //   type: Sequelize.UUID,
      //   allowNull: true
      // },
      // fkStatus: {
      //   type: Sequelize.UUID,
      //   allowNull: true
      // },

      // fkUsuario: {
      //   type: Sequelize.UUID,
      //   allowNull: true
      // },

      // fkUnidade: {
      //   type: Sequelize.UUID,
      //   allowNull: true
      // },

      // flagDemandado: {
      //   type: Sequelize.BOOLEAN,
      //   allowNull: false,
      //   defaultValue: false,

      // },



      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('aluno')
  }
}
