'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crops', {
      crop_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      crop_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      crop_category: {
        type: Sequelize.ENUM('cereals', 'legumes', 'vegetables', 'fruits', 'cash_crops', 'tubers'),
        allowNull: false
      },
      planting_season: {
        type: Sequelize.ENUM('dry_season', 'wet_season', 'year_round'),
        allowNull: false
      },
      growing_duration_days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      expected_yield_per_hectare: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      average_market_price_per_kg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      water_requirements: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium'
      },
      soil_type: {
        type: Sequelize.ENUM('any', 'clay', 'loam', 'sandy'),
        allowNull: false,
        defaultValue: 'any'
      },
      risk_level: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium'
      },
      suitable_for_smallholders: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('crops', ['crop_name']);
    await queryInterface.addIndex('crops', ['crop_category']);
    await queryInterface.addIndex('crops', ['planting_season']);
    await queryInterface.addIndex('crops', ['suitable_for_smallholders']);
    await queryInterface.addIndex('crops', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('crops');
  }
}; 