'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('erro', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      turma: {
        type: Sequelize.STRING,
        allowNull: true,
      
      },
      aluno: {
        type: Sequelize.STRING,
        allowNull: true,
      
      },
      profissional: {
        type: Sequelize.STRING,
        allowNull: true,
      
      },

      descricao: {
        type: Sequelize.TEXT,
        allowNull: true,
      
      },
      corrigido: {
        type: Sequelize.STRING,
        allowNull: true,
      
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('erro')
  }
}
