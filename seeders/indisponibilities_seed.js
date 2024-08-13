'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Récupérer les ID existants dans la table 'Enterprises'
    const existingEnterpriseIds = await queryInterface.sequelize.query(
      `SELECT id FROM "Enterprises";`
    );
    const enterpriseIds = existingEnterpriseIds[0].map(entry => entry.id);

    // Vérifier que vous avez des ID d'entreprise avant de continuer
    if (!enterpriseIds.length) {
      throw new Error('Aucun ID d\'entreprise trouvé. Assurez-vous que la table \'Enterprises\' contient des données.');
    }

    // Créer vos seeds pour 'Indisponibilities'
    const indisponibilities = [];
    for (let i = 0; i < 10; i++) {
      indisponibilities.push({
        start_date: faker.date.future(),
        start_hour: '09:00',
        end_date: faker.date.future(),
        end_hour: '18:00',
        Enterprise_id: enterpriseIds[i % enterpriseIds.length], 
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Indisponibilities', indisponibilities, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Indisponibilities', null, {});
  }
};