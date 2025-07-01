'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the existing HealthFacilities table if it exists
    try {
      await queryInterface.dropTable('HealthFacilities');
      console.log('Dropped existing HealthFacilities table');
    } catch (error) {
      console.log('HealthFacilities table does not exist or already dropped');
    }
  },

  async down(queryInterface, Sequelize) {
    // This migration only drops, so down does nothing
  }
}; 