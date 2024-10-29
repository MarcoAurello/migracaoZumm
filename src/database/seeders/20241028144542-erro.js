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

    // const unidades = await queryInterface.sequelize.query('select * from unidade where nome = \'Gerência de Tecnologia da Informação\'')

    await queryInterface.bulkInsert('erro', [
      {
      id: uuid(),
      turma: 'Sistemas - Desenvolvimento',
      aluno: 'Sistemas - Desenvolvimento',
     
      profissional: 'Sistemas - Desenvolvimento',
     
      descricao: 'Sistemas - Desenvolvimento',
     
     
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('erro', null, {})
  }
}
