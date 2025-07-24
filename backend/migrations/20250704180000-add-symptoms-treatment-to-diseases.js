'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('diseases');
    if (!tableDescription.symptoms) {
      await queryInterface.addColumn('diseases', 'symptoms', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    if (!tableDescription.treatment) {
      await queryInterface.addColumn('diseases', 'treatment', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('diseases', 'symptoms');
    await queryInterface.removeColumn('diseases', 'treatment');
  },
}; 