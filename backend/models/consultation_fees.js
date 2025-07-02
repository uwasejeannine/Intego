"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ConsultationFee extends Model {
    static associate(models) {
      ConsultationFee.belongsTo(models.HealthFacility, {
        foreignKey: 'hospital_id',
        as: 'hospital',
      });
      ConsultationFee.belongsTo(models.Disease, {
        foreignKey: 'disease_id',
        as: 'disease',
      });
    }
  }
  ConsultationFee.init(
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
      disease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      age_group: {
        type: DataTypes.STRING, // e.g., 'child', 'adult', 'maternity'
      },
      payment_option: {
        type: DataTypes.STRING, // e.g., 'cash', 'RSSB', 'Mutuelle'
      },
    },
    {
      sequelize,
      modelName: "ConsultationFee",
      tableName: "consultation_fees",
    }
  );
  return ConsultationFee;
}; 