'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmers', {
      farmer_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      region_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'regions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      farm_location: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      total_farm_area_hectares: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      years_experience: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      farmer_type: {
        type: Sequelize.ENUM('smallholder', 'commercial', 'cooperative', 'estate'),
        allowNull: false,
        defaultValue: 'smallholder'
      },
      primary_crops: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cooperative_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'cooperatives',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      registration_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmers');
  }
};