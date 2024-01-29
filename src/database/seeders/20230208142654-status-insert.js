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
    await queryInterface.bulkInsert('status', [
      { id: uuid(), descricao: 'Aberto', createdAt: new Date(), updatedAt: new Date() },
      { id: uuid(), descricao: 'Planejado para Iniciar', createdAt: new Date(), updatedAt: new Date() },
      { id: uuid(), descricao: 'Iniciado', createdAt: new Date(), updatedAt: new Date() },
      { id: uuid(), descricao: 'Cancelado', createdAt: new Date(), updatedAt: new Date() },
      { id: uuid(), descricao: 'Concluido', createdAt: new Date(), updatedAt: new Date() },
      { id: uuid(), descricao: 'Pendente', createdAt: new Date(), updatedAt: new Date() },
      { id: uuid(), descricao: 'Parado', createdAt: new Date(), updatedAt: new Date() }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('status', null, {})
  }
}
