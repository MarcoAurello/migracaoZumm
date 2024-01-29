'use strict'
const { uuid } = require('uuidv4')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('perfil', [
      { id: uuid(), nome: 'Administrador', createdAt: new Date(), updatedAt: new Date() },
      { id: uuid(), nome: 'Gerente', createdAt: new Date(), updatedAt: new Date() },
      { id: uuid(), nome: 'Coordenador', createdAt: new Date(), updatedAt: new Date() },
      { id: uuid(), nome: 'Funcionário', createdAt: new Date(), updatedAt: new Date() }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('perfil', null, {})
  }
}
