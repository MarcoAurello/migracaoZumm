
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

    const unidade = await queryInterface.sequelize.query('select * from unidade where nome = \'Gerência de Tecnologia da Informação\'')

    await queryInterface.bulkInsert('turma', [
      {
        id: uuid(),
        turmaNome: 'Ingles22',
        codigoFormatado: '232323',
        dataInicio: new Date(),
        dataTermino: new Date(),
        criadoNoTeams: false,
        idTurmaTeams:'sasasaas',
        ativo: true,
        linkTurma:'1',
    
        fkUnidade: unidade[0][0].id,
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
    await queryInterface.bulkDelete('turma', null, {})
  }
}
