'use strict';
const { faker } = require("@faker-js/faker/locale/fr");

const citiesWithCoordinates = [
  { city: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { city: 'Marseille', latitude: 43.2965, longitude: 5.3698 },
  { city: 'Lyon', latitude: 45.7640, longitude: 4.8357 },
  { city: 'Cugnaux', latitude: 43.5371, longitude: 1.3450 },
  { city: 'Nice', latitude: 43.7102, longitude: 7.2620 },
  { city: 'Nantes', latitude: 47.2184, longitude: -1.5536 },
  { city: 'Strasbourg', latitude: 48.5734, longitude: 7.7521 },
  { city: 'Montpellier', latitude: 43.6108, longitude: 3.8767 },
  { city: 'Bordeaux', latitude: 44.8378, longitude: -0.5792 },
  { city: 'Lille', latitude: 50.6292, longitude: 3.0573 },
  { city: 'Rennes', latitude: 48.1173, longitude: -1.6778 },
  { city: 'Reims', latitude: 49.2628, longitude: 4.0347 },
  { city: 'Le Havre', latitude: 49.4944, longitude: 0.1079 },
  { city: 'Saint-Étienne', latitude: 45.4397, longitude: 4.3872 },
  { city: 'Toulon', latitude: 43.1242, longitude: 5.9280 },
  { city: 'Grenoble', latitude: 45.1885, longitude: 5.7245 },
  { city: 'Dijon', latitude: 47.3220, longitude: 5.0415 },
  { city: 'Angers', latitude: 47.4784, longitude: -0.5632 },
  { city: 'Nîmes', latitude: 43.8367, longitude: 4.3601 },
  { city: 'Villeurbanne', latitude: 45.7719, longitude: 4.8902 },
  { city: 'Clermont-Ferrand', latitude: 45.7772, longitude: 3.0870 },
  { city: 'La Rochelle', latitude: 46.1591, longitude: -1.1511 },
  { city: 'Amiens', latitude: 49.8942, longitude: 2.2957 },
  { city: 'Limoges', latitude: 45.8336, longitude: 1.2611 },
  { city: 'Annecy', latitude: 45.8992, longitude: 6.1289 }
];

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
      // Sélectionnez une ville et ses coordonnées de manière aléatoire
      const randomCityIndex = faker.datatype.number({ min: 0, max: citiesWithCoordinates.length - 1 });
      const { city, latitude, longitude } = citiesWithCoordinates[randomCityIndex];
      entreprises.push({
        name: faker.company.name(),
        phone: faker.phone.number(),
        mail: faker.internet.email(),
        adress: faker.address.streetAddress(),
        city: city,
        zip_code: faker.address.zipCode(),
        siret_number: faker.datatype.number({ min: 10000000000000, max: 99999999999999 }).toString(),
        description: faker.company.catchPhrase(),
        website: faker.internet.url(),
        facebook: `https://facebook.com/${faker.internet.userName()}`,
        instagram: `https://instagram.com/${faker.internet.userName()}`,
        twitter: `https://twitter.com/${faker.internet.userName()}`,
        logo: faker.image.imageUrl(400, 300, 'business', true, true),
        isValidate: true,
        latitude: latitude,
        longitude: longitude,
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