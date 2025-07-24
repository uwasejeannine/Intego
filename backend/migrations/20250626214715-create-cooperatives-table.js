'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cooperatives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cooperative_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      number_of_farmers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_land_size: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      contact_person_phone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      contact_person_email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      main_crops: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('cooperatives');
  }
};