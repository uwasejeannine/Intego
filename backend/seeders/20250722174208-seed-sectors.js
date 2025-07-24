'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const districts = await queryInterface.sequelize.query(
      `SELECT id, name from "districts";`
    );
    const districtRows = districts[0];
    const districtMap = {};
    for (const district of districtRows) {
      districtMap[district.name] = district.id;
    }

    await queryInterface.bulkInsert('sectors', [
      // Bugesera
      { name: 'Gashora', district_id: districtMap['Bugesera'] },
      { name: 'Juru', district_id: districtMap['Bugesera'] },
      { name: 'Kamabuye', district_id: districtMap['Bugesera'] },

      // Gatsibo
      { name: 'Gasange', district_id: districtMap['Gatsibo'] },
      { name: 'Gatsibo', district_id: districtMap['Gatsibo'] },
      { name: 'Gitoki', district_id: districtMap['Gatsibo'] },

      // Gasabo
      { name: 'Bumbogo', district_id: districtMap['Gasabo'] },
      { name: 'Gatsata', district_id: districtMap['Gasabo'] },
      { name: 'Jali', district_id: districtMap['Gasabo'] },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('sectors', null, {});
  }
}; 