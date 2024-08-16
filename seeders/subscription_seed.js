'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const subscriptions = [];

    // Récupérer les ID existants dans la table 'Enterprises'
    const existingEnterpriseIds = await queryInterface.sequelize.query(
      `SELECT id FROM "Enterprises";`
    );
    const enterpriseIds = existingEnterpriseIds[0].map(entry => entry.id);

    // Vérifier que vous avez des ID d'entreprise avant de continuer
    if (!enterpriseIds.length) {
      throw new Error('Aucun ID d\'entreprise trouvé. Assurez-vous que la table \'Enterprises\' contient des données.');
    }

    for (let i = 1; i <= 20; i++) {
      subscriptions.push({
        subscription_type: faker.helpers.arrayElement(['monthly', 'yearly', 'forever']),
        status: faker.helpers.arrayElement(['active', 'inactive']),
        start_date: faker.date.past(),
        end_date: faker.date.future(),
        Enterprise_id: enterpriseIds[i % enterpriseIds.length],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Subscriptions', subscriptions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Subscriptions', null, {});
  }
};