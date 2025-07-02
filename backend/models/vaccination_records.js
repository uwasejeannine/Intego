const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class VaccinationRecord extends Model {}
  VaccinationRecord.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    patient_name: { type: DataTypes.STRING, allowNull: false },
    patient_id: { type: DataTypes.STRING },
    vaccine_id: { type: DataTypes.INTEGER, allowNull: false },
    facility_id: { type: DataTypes.INTEGER, allowNull: false },
    date_administered: { type: DataTypes.DATE, allowNull: false },
    dose_number: { type: DataTypes.INTEGER },
    notes: { type: DataTypes.TEXT },
  }, {
    sequelize,
    modelName: 'VaccinationRecord',
    tableName: 'vaccination_records',
    timestamps: true,
  });

  VaccinationRecord.associate = (models) => {
    VaccinationRecord.belongsTo(models.Vaccine, {
      foreignKey: 'vaccine_id',
      as: 'vaccine',
    });
    VaccinationRecord.belongsTo(models.HealthFacility, {
      foreignKey: 'facility_id',
      as: 'facility',
    });
  };

  return VaccinationRecord;
}; 