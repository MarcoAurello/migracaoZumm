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
    await queryInterface.createTable('configuracaoGeral', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      autenticacaoAd: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      host: {
        type: Sequelize.STRING,
        allowNull: true
      },
      porta: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ssl: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      template: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      urlAd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      baseDN: {
        type: Sequelize.STRING,
        allowNull: true
      },
      usernameAd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      passwordAd: {
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('configuracaoGeral')
  }
}
