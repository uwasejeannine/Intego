"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Archive extends Model {
    static associate(models) {
      Archive.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
        onDelete: "CASCADE",
      });
      Archive.belongsTo(models.Category, {
        foreignKey: "categoriesId",
        as: "categories",
        onDelete: "CASCADE",
      });
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
