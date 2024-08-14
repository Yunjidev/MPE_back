'use strict';
const { faker } = require("@faker-js/faker/locale/fr");

module.exports = {
  async up (queryInterface, Sequelize) {
    // Assurez-vous d'abord que les utilisateurs, les jobs et les pays existent dans votre base de données
    const users = await queryInterface.sequelize.query(`SELECT id FROM "Users";`);
    const jobs = await queryInterface.sequelize.query(`SELECT id FROM "Jobs";`);
    const countries = await queryInterface.sequelize.query(`SELECT id FROM "Countries";`);

    const userRows = users[0];
    const jobRows = jobs[0];
    const countryRows = countries[0];

    const entreprises = [];
    for (let i = 0; i < 25; i++) {
      entreprises.push({
        name: faker.company.name(),
        phone: faker.phone.number(),
        mail: faker.internet.email(),
        adress: faker.address.streetAddress(),
        city: faker.address.city(),
        zip_code: faker.address.zipCode(),
        siret_number: faker.datatype.number({ min: 10000000000000, max: 99999999999999 }).toString(),
        description: faker.company.catchPhrase(),
        website: faker.internet.url(),
        facebook: `https://facebook.com/${faker.internet.userName()}`,
        instagram: `https://instagram.com/${faker.internet.userName()}`,
        twitter: `https://twitter.com/${faker.internet.userName()}`,
        logo: faker.image.business(),
        isValidate: true,
        Job_id: jobRows[faker.datatype.number({ min: 0, max: jobRows.length - 1 })].id,
        Country_id: countryRows[faker.datatype.number({ min: 0, max: countryRows.length - 1 })].id,
        User_id: userRows[faker.datatype.number({ min: 0, max: userRows.length - 1 })].id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Enterprises', entreprises, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Enterprises', null, {});
  }
};