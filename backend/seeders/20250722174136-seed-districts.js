'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, seed the roles
    await queryInterface.bulkInsert('Roles', [
      {
        id: 3,
        name: 'admin',
        description: 'Administrator with full access'
      },
      {
        id: 4,
        name: 'districtAdministrator',
        description: 'District level administrator'
      },
      {
        id: 2,
        name: 'sectorCoordinator',
        description: 'Sector level coordinator'
      }
    ], {});

    // Then seed the districts
    await queryInterface.bulkInsert('Districts', [
      {
        name: 'Gasabo',
        code: 'GSB'
      },
      {
        name: 'Kicukiro',
        code: 'KCK'
      },
      {
        name: 'Nyarugenge',
        code: 'NRG'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Districts', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
