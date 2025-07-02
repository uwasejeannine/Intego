const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Vaccine extends Model {}
  Vaccine.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    manufacturer: { type: DataTypes.STRING },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    expiry_date: { type: DataTypes.DATE },
    batch_number: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('active', 'expired', 'inactive'), defaultValue: 'active' },
  }, {
    sequelize,
    modelName: 'Vaccine',
    tableName: 'vaccines',
    timestamps: true,
  });

  Vaccine.associate = (models) => {
    Vaccine.hasMany(models.VaccinationRecord, {
      foreignKey: 'vaccine_id',
      as: 'vaccinationRecords',
    });
  };

  return Vaccine;
}; 