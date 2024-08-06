'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Enterprises', [
      {
        name: 'Entreprise A',
        phone: '0102030405',
        mail: 'contact@entreprisea.com',
        adress: '123 rue de lEntreprise',
        city: 'Lyon',
        zip_code: '69000',
        siret_number: '123 456 789 00011',
        description: 'Description de l\'Entreprise A.',
        facebook: 'https://facebook.com/entreprisea',
        instagram: 'https://instagram.com/entreprisea',
        twitter: 'https://twitter.com/entreprisea',
        photos: null,
        isValidate: true,
        Job_id: 1, 
        User_id: 1, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Entreprise B',
        phone: '0203040506',
        mail: 'contact@entrepriseb.com',
        adress: '234 avenue du Progrès',
        city: 'Paris',
        zip_code: '75000',
        siret_number: '987 654 321 00022',
        description: 'Description de l\'Entreprise B.',
        facebook: 'https://facebook.com/entrepriseb',
        instagram: 'https://instagram.com/entrepriseb',
        twitter: 'https://twitter.com/entrepriseb',
        photos: null,
        isValidate: false,
        Job_id: 2,
        User_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Entreprise C',
        phone: '0203040506',
        mail: 'contact@entrepriseb.com',
        adress: '234 avenue du Progrès',
        city: 'Toulouse',
        zip_code: '31000',
        siret_number: '987 654 321 00022',
        description: 'Description de l\'Entreprise C.',
        facebook: 'https://facebook.com/entreprisec',
        instagram: 'https://instagram.com/entreprisec',
        twitter: 'https://twitter.com/entreprisec',
        photos: null,
        isValidate: false,
        Job_id: 3,
        User_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ... autres entreprises
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Enterprises', null, {});
  }
};