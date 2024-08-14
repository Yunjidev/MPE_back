'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Récupérer les ID existants dans les tables 'Users' et 'Offers'
    const existingUserIds = await queryInterface.sequelize.query(
      `SELECT id FROM "Users";`
    );
    const userIds = existingUserIds[0].map(entry => entry.id);

    const existingOfferIds = await queryInterface.sequelize.query(
      `SELECT id FROM "Offers";`
    );
    const offerIds = existingOfferIds[0].map(entry => entry.id);

    // Vérifier que vous avez des ID d'utilisateur et d'offre avant de continuer
    if (!userIds.length || !offerIds.length) {
      throw new Error('Aucun ID d\'utilisateur ou d\'offre trouvé. Assurez-vous que les tables \'Users\' et \'Offers\' contiennent des données.');
    }

    // Créer vos seeds pour 'Reservations'
    const reservations = [];
    for (let i = 0; i < 10; i++) {
      reservations.push({
        date: faker.date.future(),
        start_time: faker.date.recent().toISOString().split('T')[1].substr(0, 5),
        end_time: faker.date.recent().toISOString().split('T')[1].substr(0, 5),
        status: 'done', // Statut fixé à 'done'
        User_id: userIds[i % userIds.length],
        Offer_id: offerIds[i % offerIds.length],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Reservations', reservations, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reservations', null, {});
  }
};