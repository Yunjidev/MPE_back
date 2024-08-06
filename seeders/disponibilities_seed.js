'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const disponibilitiesData = [
      // Disponibilités pour l'Entreprise A (ID 7)
      {
        day: 'Lundi',
        start_hour: '08:00',
        end_hour: '12:00',
        Enterprise_id: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Mardi',
        start_hour: '08:00',
        end_hour: '12:00',
        Enterprise_id: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Disponibilités pour l'Entreprise B (ID 8)
      {
        day: 'Lundi',
        start_hour: '08:00',
        end_hour: '12:00',
        Enterprise_id: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Mardi',
        start_hour: '08:00',
        end_hour: '12:00',
        Enterprise_id: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Disponibilités pour l'Entreprise C (ID 9)
      {
        day: 'Lundi',
        start_hour: '08:00',
        end_hour: '12:00',
        Enterprise_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Mardi',
        start_hour: '08:00',
        end_hour: '12:00',
        Enterprise_id: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ... Ajoutez d'autres disponibilités pour d'autres entreprises si nécessaire ...
    ];

    await queryInterface.bulkInsert('Disponibilities', disponibilitiesData);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Disponibilities', null, {});
  }
};