'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
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
      description: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('Roles', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
}; 