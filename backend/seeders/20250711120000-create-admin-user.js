"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwordHash = await bcrypt.hash("GanzAfrica6!", 10);
    await queryInterface.bulkInsert("Users", [
      {
        username: "jeannine.uganzAfrica",
        email: "jeannine.uganzAfrica@gmail.com",
        password: passwordHash,
        first_name: "Jeannine",
        last_name: "UganzAfrica",
        gender: "Female",
        phoneNumber: "+2507xxxxxxx",
        sectorofOperations: "Health",
        profileImage: null,
        roleId: 3,
        status: "Active",
        loginAttempts: 0,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", { email: "jeannine.uganzAfrica@gmail.com" });
  },
}; 