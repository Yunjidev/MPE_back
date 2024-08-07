'use strict';
const { faker } = require("@faker-js/faker/locale/fr");

module.exports = {
  async up (queryInterface, Sequelize) {
    const entreprises = [];
    for (let i = 0; i < 15; i++) {
      entreprises.push({
        name: faker.company.name(),
        phone: faker.phone.number(),
        mail: faker.internet.email(),
        adress: faker.location.streetAddress(),
        city: faker.location.city(),
        zip_code: faker.location.zipCode(),
        siret_number: faker.string.alphanumeric(14),
        description: faker.company.catchPhrase(),
        website: faker.internet.url(),
        facebook: `https://facebook.com/${faker.internet.userName()}`,
        instagram: `https://instagram.com/${faker.internet.userName()}`,
        twitter: `https://twitter.com/${faker.internet.userName()}`,
        photos: JSON.stringify([faker.image.urlLoremFlickr({ category: 'business' })]),
        isValidate: faker.datatype.boolean(),
        Job_id: faker.datatype.number({ min: 1, max: 10 }),
        Country_id: faker.datatype.number({ min: 1, max: 10 }),
        User_id: faker.datatype.number({ min: 1, max: 10 }),
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