'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schools', {
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
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attendance: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      studentsPerClass: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      faculties: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dropoutRate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      headTeacher: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      performance: {
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
    await queryInterface.dropTable('Schools');
  }
}; 