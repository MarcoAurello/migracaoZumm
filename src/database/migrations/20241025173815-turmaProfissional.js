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
    await queryInterface.createTable('turmaProfissional', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      fkTurma: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fkProfissional: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('turmaProfissional')
  }
}
