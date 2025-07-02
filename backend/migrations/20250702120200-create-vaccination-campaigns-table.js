module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vaccination_campaigns', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      start_date: { type: Sequelize.DATE, allowNull: false },
      end_date: { type: Sequelize.DATE },
      target_population: { type: Sequelize.STRING },
      vaccines: { type: Sequelize.STRING },
      status: { type: Sequelize.ENUM('planned', 'ongoing', 'completed', 'cancelled'), defaultValue: 'planned' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('vaccination_campaigns');
  }
}; 