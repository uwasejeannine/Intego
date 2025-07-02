const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class VaccinationCampaign extends Model {}
  VaccinationCampaign.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE },
    target_population: { type: DataTypes.STRING },
    vaccines: { type: DataTypes.STRING }, // Comma-separated vaccine names or IDs
    status: { type: DataTypes.ENUM('planned', 'ongoing', 'completed', 'cancelled'), defaultValue: 'planned' },
  }, {
    sequelize,
    modelName: 'VaccinationCampaign',
    tableName: 'vaccination_campaigns',
    timestamps: true,
  });
  // TODO: Add associations if campaigns should be linked to vaccines/facilities
  return VaccinationCampaign;
}; 