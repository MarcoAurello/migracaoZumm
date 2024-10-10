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
    await queryInterface.bulkInsert('unidade', [
      {
      id: uuid(),
      nome: 'Gerência de Tecnologia da Informação',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuid(),
      nome: 'UEP-REC',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuid(),
      nome: 'UHT',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      nome: 'UEP-Petrolina',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
     {
      id: uuid(),
      nome: 'UEP-Caruaru',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuid(),
      nome: 'UEP-Vitoria',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuid(),
      nome: 'UEP-Serra Talhada',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuid(),
      nome: 'UEP-Paulista',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: uuid(),
      nome: 'UEP-Garanhuns',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuid(),
      nome: 'Faculdade',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuid(),
      nome: 'UIP',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuid(),
      nome: 'CETII',
      ativa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  
  ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('unidade', null, {})
  }
}
