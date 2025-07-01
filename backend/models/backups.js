"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Backup extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  Backup.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      backuptype: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creationTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Backup",
      tableName: "Backups",
      timestamps: false,
    },
  );

  return Backup;
};
