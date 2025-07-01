"use strict";
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Backups", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      filePath: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      backuptype: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      creationTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      scheduleId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Backups");
  },
};
