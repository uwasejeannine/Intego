'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('diseases', 'symptoms', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('diseases', 'treatment', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('diseases', 'symptoms');
    await queryInterface.removeColumn('diseases', 'treatment');
  },
}; 