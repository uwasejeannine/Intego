module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vaccination_records', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      patient_name: { type: Sequelize.STRING, allowNull: false },
      patient_id: { type: Sequelize.STRING },
      vaccine_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'vaccines', key: 'id' }, onDelete: 'CASCADE' },
      facility_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'healthfacilities', key: 'facility_id' }, onDelete: 'CASCADE' },
      date_administered: { type: Sequelize.DATE, allowNull: false },
      dose_number: { type: Sequelize.INTEGER },
      notes: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('vaccination_records');
  }
}; 