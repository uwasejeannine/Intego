const { Sequelize, DataTypes } = require("sequelize");

("use strict");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Archives", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      projectId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      categoriesId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      archive_date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Archives");
  },
};
