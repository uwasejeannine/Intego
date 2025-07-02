'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Students', {
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
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      enrollment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      attendance: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      disability: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ovc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transfers: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      health: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      class: {
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
    await queryInterface.dropTable('Students');
  }
}; 