'use strict';

const { faker } = require("@faker-js/faker/locale/fr");
const addDays = (days) => {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
};


module.exports = {
  async up (queryInterface, Sequelize) {
    // Récupérez les ID des entreprises existantes
    const entreprises = await queryInterface.sequelize.query(
      `SELECT id FROM "Enterprises";`
    );
    const entrepriseRows = entreprises[0];
    const disponibilitiesData = entrepriseRows.map(entreprise => {
      return {
        day: faker.date.weekday(),
        start_hour: '08:00',
        end_hour: '12:00',
        Enterprise_id: entreprise.id,
        createdAt: addDays(faker.number.int({ 'min': 1, 'max': 30 })),
        updatedAt: addDays(faker.number.int({ 'min': 1, 'max': 30 }))
      };
    });

    await queryInterface.bulkInsert('Disponibilities', disponibilitiesData);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Disponibilities', null, {});
  }
};