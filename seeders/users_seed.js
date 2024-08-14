'use strict';
const { faker } = require('@faker-js/faker/locale/fr');

module.exports = {
  async up (queryInterface, Sequelize) {
    const usersData = [];
    for (let i = 0; i < 50; i++) {
      usersData.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(), // Assurez-vous de hasher les mots de passe en production
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