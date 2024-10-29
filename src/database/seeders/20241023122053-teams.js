
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

   
    await queryInterface.bulkInsert('teams', [
      // {
      //   id: uuid(),
    
      //   fkTurma: 'xx123',
      //   idTurmaTeams: 'email@ggg',
      //   nomeEquipe: 'emailCadastro',
      //   linkTurma:'emailCadastro',
      //   status: 'true',
      //   ativo: false,
    
      
       
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
    await queryInterface.bulkDelete('teams', null, {})
  }
}
