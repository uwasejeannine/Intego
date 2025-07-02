"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Archive extends Model {
    static associate(models) {
      // Removed associations to Project and Category as they are not used
    }
  }

  Archive.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoriesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      archive_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Archive",
      tableName: "Archives",
      timestamps: false,
    },
  );

  return Archive;
};
