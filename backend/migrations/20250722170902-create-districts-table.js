'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Districts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('Districts', ['name']);
    await queryInterface.addIndex('Districts', ['code']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Districts');
  }
};
