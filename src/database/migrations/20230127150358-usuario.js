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
    await queryInterface.createTable('usuario', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      chapa: {
        type: Sequelize.STRING,
        allowNull: true
      },
      demandante: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      fkPerfil: {
        type: Sequelize.UUID,
        allowNull: true
      },
      fkArea: {
        type: Sequelize.UUID,
        allowNull: true
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      validado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      fkValidador: {
        type: Sequelize.UUID,
        allowNull: true
      },
      primeiroLogin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('usuario')
  }
}
