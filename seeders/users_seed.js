'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123', // Assurez-vous de hasher les mots de passe en production
        resetPasswordToken: null,
        resetPasswordExpires: null,
        isAdmin: false,
        avatar: 'url_avatar_user1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123', // Assurez-vous de hasher les mots de passe en production
        resetPasswordToken: null,
        resetPasswordExpires: null,
        isAdmin: false,
        avatar: 'url_avatar_user2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ... Ajoutez ici les autres utilisateurs
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};