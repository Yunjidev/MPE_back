'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Récupérer les ID existants dans les tables 'Offers' et 'Users'
    const existingOfferIds = await queryInterface.sequelize.query(
      `SELECT id FROM "Offers";`
    );
    const offerIds = existingOfferIds[0].map(entry => entry.id);

    const existingUserIds = await queryInterface.sequelize.query(
      `SELECT id FROM "Users";`
    );
    const userIds = existingUserIds[0].map(entry => entry.id);

    // Vérifier que vous avez des ID d'offre et d'utilisateur avant de continuer
    if (!offerIds.length || !userIds.length) {
      throw new Error('Aucun ID d\'offre ou d\'utilisateur trouvé. Assurez-vous que les tables \'Offers\' et \'Users\' contiennent des données.');
    }

    // Créer vos seeds pour 'Ratings'
    const ratings = [];
    for (let i = 0; i < 10; i++) {
      ratings.push({
        note: faker.datatype.float({ min: 0, max: 5, precision: 0.1 }),
        comment: faker.lorem.sentence(),
        Offer_id: offerIds[i % offerIds.length], 
        User_id: userIds[i % userIds.length], 
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Ratings', ratings, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ratings', null, {});
  }
};