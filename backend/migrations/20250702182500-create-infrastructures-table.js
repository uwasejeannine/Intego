'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Infrastructures', {
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
      classrooms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      desks: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      labs: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      libraries: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      latrines: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      electricity: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      water: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      meals: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ict: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      textbooks: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      materials: {
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
    await queryInterface.dropTable('Infrastructures');
  }
}; 