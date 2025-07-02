'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Teachers', {
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
      subject: {
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
      recruitment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      training: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cpd: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      retirement: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ratio: {
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
    await queryInterface.dropTable('Teachers');
  }
}; 