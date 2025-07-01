'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cooperatives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cooperativeName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numberOfFarmers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalLandSize: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      contactPersonPhone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      contactPersonEmail: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      mainCrops: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      regionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Regions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cooperatives');
  }
};