"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Region extends Model {
    static associate(models) {
      Region.hasMany(models.Farmer, {
        foreignKey: "region_id",
        as: "farmers",
        onDelete: "SET NULL",
      });
      Region.hasMany(models.Cooperative, {
        foreignKey: "region_id",
        as: "cooperatives",
        onDelete: "SET NULL",
      });
    }
  }

  Region.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      region_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Region name cannot be empty",
          },
          len: {
            args: [2, 100],
            msg: "Region name must be between 2 and 100 characters",
          },
        },
      },
      region_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Region code cannot be empty",
          },
          isUppercase: {
            msg: "Region code must be uppercase",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Region",
      tableName: "regions",
      timestamps: true,
      underscored: true,
    }
  );

  return Region;
};
