'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Jobs', [
      {
        name: 'Développeur Web',
        picture: '../public/images/devwebp.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Designer Graphique',
        picture: '../public/images/designer.webp',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Analyste de Données',
        picture: '../public/images/datanylste.webp',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chef de Projet',
        picture: '../public/images/chefdeprojet.webp',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Expert en Cybersécurité',
        picture: '../public/images/cybersecu.webp',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Jobs', null, {});
  }
};
