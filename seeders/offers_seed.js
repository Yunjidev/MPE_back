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

    // Créer vos seeds pour 'Offers'
    const offers = [];
    for (let i = 0; i < 10; i++) {
      offers.push({
        name: faker.commerce.productName(),
        description: faker.lorem.sentences(),
        duration: faker.datatype.number({ min: 30, max: 120 }),
        image: faker.image.imageUrl(),
        price: faker.commerce.price(),
        estimate: faker.datatype.boolean(),
        Enterprise_id: enterpriseIds[i % enterpriseIds.length], 
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Offers', offers, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Offers', null, {});
  }
};