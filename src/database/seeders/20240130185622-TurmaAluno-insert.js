
'use strict'

const bcrypt = require('bcrypt')
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

    // const perfilsAdministrador = await queryInterface.sequelize.query('select * from perfil where nome = \'Administrador\'')
    // const perfilAdministradorRows = perfilsAdministrador[0]

    // const perfilsGerente = await queryInterface.sequelize.query('select * from perfil where nome = \'Gerente\'')
    // const perfilGerenteRows = perfilsGerente[0]

    const aluno = await queryInterface.sequelize.query('select * from aluno where nome = \'joão\'')
    const turma = await queryInterface.sequelize.query('select * from turma where turmaNome = \'Ingles22\'')

    await queryInterface.bulkInsert('turmaAluno', [
      // {
      //   id: uuid(),
      //   fkTurma:turma[0][0].id,
      //   fkAluno: aluno[0][0].id,
      //   criadoNoTeams:false,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
    
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('turmaAluno', null, {})
  }
}
