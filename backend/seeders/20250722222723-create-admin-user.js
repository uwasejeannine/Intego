'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await queryInterface.bulkInsert('Users', [{
      username: 'jeannine',
      email: 'jeannineuwasee@gmail.com',
      password: hashedPassword,
      first_name: 'Jeannine',
      last_name: 'Uwase',
      gender: 'Female',
      phoneNumber: '+250780000000',
      sectorofOperations: 'Agriculture',
      roleId: 3,
      status: 'Active',
      loginAttempts: 0
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'jeannineuwasee@gmail.com' }, {});
  }
};
