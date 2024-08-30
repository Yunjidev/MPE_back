'use strict';
const { faker } = require('@faker-js/faker/locale/fr');
const bcrypt = require("bcryptjs");

module.exports = {
  async up (queryInterface, Sequelize) {
    
    const usersData = [];
    for (let i = 0; i < 50; i++) {
      const hash = await bcrypt.hash("password123", 10);
      usersData.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: hash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        isAdmin: faker.datatype.boolean(),
        isEntrepreneur: true,
        avatar: faker.image.avatar(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Users', usersData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};