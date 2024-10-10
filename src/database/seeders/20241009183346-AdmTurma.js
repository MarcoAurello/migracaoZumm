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

    
    await queryInterface.bulkInsert('admTurma', [{
      id: uuid(),
      nome: 'teste',
      unidade: 'UEP -Recife',
      email: 'a@123456',
    
      createdAt: new Date(),
      updatedAt: new Date()
    },], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('admTurma', null, {})
  }
}
