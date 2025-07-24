'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add district_id column if it doesn't exist
    try {
      await queryInterface.addColumn('Users', 'district_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Districts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    } catch (error) {
      console.log('district_id column might already exist:', error.message);
    }

    // Add sector_id column if it doesn't exist
    try {
      await queryInterface.addColumn('Users', 'sector_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Sectors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    } catch (error) {
      console.log('sector_id column might already exist:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns if they exist
    try {
      await queryInterface.removeColumn('Users', 'district_id');
    } catch (error) {
      console.log('Error removing district_id:', error.message);
    }

    try {
      await queryInterface.removeColumn('Users', 'sector_id');
    } catch (error) {
      console.log('Error removing sector_id:', error.message);
    }
  }
};
