'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Récupérer les ID des offres et des utilisateurs associés aux réservations 'done'
    const doneReservations = await queryInterface.sequelize.query(
      `SELECT "Offer_id", "User_id" FROM "Reservations" WHERE status = 'done';`
    );
    const doneReservationsRows = doneReservations[0];

    // Vérifier que vous avez des réservations 'done' avant de continuer
    if (!doneReservationsRows.length) {
      throw new Error('Aucune réservation avec le statut "done" trouvée. Assurez-vous que la table \'Reservations\' contient des données appropriées.');
    }

    // Créer vos seeds pour 'Ratings' associés aux réservations 'done'
    const ratings = doneReservationsRows.map(reservation => ({
      note: Math.ceil(faker.datatype.float({ min: 0, max: 5 })),
      comment: faker.lorem.sentence(),
      Offer_id: reservation.Offer_id, // Lier la note à l'offre de la réservation 'done'
      User_id: reservation.User_id, // Lier la note à l'utilisateur de la réservation 'done'
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Ratings', ratings, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ratings', null, {});
  }
};