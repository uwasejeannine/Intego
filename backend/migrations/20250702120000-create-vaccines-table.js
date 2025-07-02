module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vaccines', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      manufacturer: { type: Sequelize.STRING },
      stock: { type: Sequelize.INTEGER, defaultValue: 0 },
      expiry_date: { type: Sequelize.DATE },
      batch_number: { type: Sequelize.STRING },
      status: { type: Sequelize.ENUM('active', 'expired', 'inactive'), defaultValue: 'active' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('vaccines');
  }
}; 