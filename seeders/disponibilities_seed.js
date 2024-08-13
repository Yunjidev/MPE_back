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
      const disponibilities = [];
      for (let i = 0; i < 10; i++) {
      disponibilities.push({
        day: faker.date.weekday(),
        start_hour: faker.datatype.number({ min: 8, max: 10 }).toString() + ':00',
        end_hour: faker.datatype.number({ min: 17, max: 19 }).toString() + ':00',
        Enterprise_id: enterpriseIds[i % enterpriseIds.length],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await queryInterface.bulkInsert('Disponibilities', disponibilities, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Disponibilities', null, {});
  }
};
