"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SpecializedTreatment extends Model {
    static associate(models) {
      SpecializedTreatment.belongsTo(models.HealthFacility, {
        foreignKey: 'hospital_id',
        as: 'facility',
      });
    }
  }
  SpecializedTreatment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING, // e.g., 'Surgery', 'Dialysis', etc.
        allowNull: false,
      },
      price_range: {
        type: DataTypes.STRING, // e.g., '20,000-50,000 RWF'
      },
      waiting_time: {
        type: DataTypes.STRING, // e.g., '2 days', '1 week'
      },
    },
    {
      sequelize,
      modelName: "SpecializedTreatment",
      tableName: "specialized_treatments",
    }
  );
  return SpecializedTreatment;
}; 