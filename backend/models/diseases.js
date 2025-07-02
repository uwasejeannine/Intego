"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Disease extends Model {
    static associate(models) {
      // Disease can be available at many hospitals
      Disease.belongsToMany(models.HealthFacility, {
        through: 'HospitalDiseases',
        foreignKey: 'disease_id',
        otherKey: 'facility_id',
        as: 'hospitals',
      });
    }
  }
  Disease.init(
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
      description: {
        type: DataTypes.TEXT,
      },
      available_at: {
        type: DataTypes.STRING, // hospital/level
      },
      consultation_fee: {
        type: DataTypes.INTEGER,
      },
      referral_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Disease",
      tableName: "diseases",
    }
  );
  return Disease;
}; 