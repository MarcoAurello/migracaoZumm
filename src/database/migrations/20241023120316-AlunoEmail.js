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
    await queryInterface.createTable('alunoEmail', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fkAluno: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      emailCadastro: {
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
        allowNull: true,
      },


      alunoVinculado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
 
 


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
    await queryInterface.dropTable('alunoEmail')
  }
}
