"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash("admin123", 10);
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          email: "admin@admin.com",
          password: hash,
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {
      username: "admin",
    });
  },
};
