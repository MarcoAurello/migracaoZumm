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
    await queryInterface.createTable('teams', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
     
      fkTurma: {
        type: Sequelize.STRING,
        allowNull: false
      },
      idTurmaTeams: {
        type: Sequelize.STRING,
        allowNull: true,

      },
      nomeEquipe: {
        type: Sequelize.STRING,
        allowNull: true,

      },
      linkTurma: {
        type: Sequelize.STRING,
        allowNull: true,

      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,

      },
  
      ativo: {
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
    await queryInterface.dropTable('teams')
  }
}
