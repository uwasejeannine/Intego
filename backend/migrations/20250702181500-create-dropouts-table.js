'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Dropouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      school: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      grade: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      earlyWarning: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pregnancy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reintegration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      absenteeism: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Dropouts');
  }
}; 