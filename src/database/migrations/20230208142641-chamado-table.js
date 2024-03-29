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
    await queryInterface.createTable('chamado', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      tituloChamado: {
        type: Sequelize.STRING,
        allowNull: true
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false,
       
      },

        criticidade: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

     
      fkUnidade: {
        type: Sequelize.UUID,
        allowNull: true
      },
      fkStatus: {
        type: Sequelize.UUID,
        allowNull: true
      },

      fkUsuario: {
        type: Sequelize.UUID,
        allowNull: true
      },

      // fkImagem: {
      //   type: Sequelize.UUID,
      //   allowNull: true
      // },

      flagDemandado :{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue : false,
  
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
    await queryInterface.dropTable('chamado')
  }
}
