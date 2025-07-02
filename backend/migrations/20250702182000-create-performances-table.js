'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Performances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      school: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      exam: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passRate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nationalAvg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      literacy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      numeracy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      trend: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lowPerforming: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      district: {
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
    await queryInterface.dropTable('Performances');
  }
}; 