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
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    
    // Créer des disponibilités pour chaque entreprise pour chaque jour de la semaine
    enterpriseIds.forEach(enterpriseId => {
      daysOfWeek.forEach(day => {
        disponibilities.push({
          day: day,
          start_hour: faker.datatype.number({ min: 8, max: 10 }).toString() + ':00',
          end_hour: faker.datatype.number({ min: 17, max: 19 }).toString() + ':00',
          Enterprise_id: enterpriseId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    });
    
    await queryInterface.bulkInsert('Disponibilities', disponibilities, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Disponibilities', null, {});
  }
};