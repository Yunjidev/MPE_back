'use strict';
const { faker } = require('@faker-js/faker');

// Fonction pour générer la prochaine date qui est un samedi ou un dimanche en français
function generateNextWeekendDates(startDate) {
  let dates = [];
  let currentDate = new Date(startDate);
  
  // Trouver le prochain samedi
  while (currentDate.getDay() !== 6) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Ajouter tous les samedis et dimanches à partir de cette date
  while (dates.length < 20) { // 10 semaines de samedis et dimanches
    dates.push({ date: new Date(currentDate), day: 'samedi' });
    currentDate.setDate(currentDate.getDate() + 1); // Dimanche
    dates.push({ date: new Date(currentDate), day: 'dimanche' });
    currentDate.setDate(currentDate.getDate() + 6); // Prochain samedi
  }
  
  return dates;
}

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

    // Créer vos seeds pour 'Indisponibilities'
    const indisponibilities = [];
    const weekendDates = generateNextWeekendDates(new Date());
    for (let i = 0; i < weekendDates.length; i++) {
      indisponibilities.push({
        start_date: weekendDates[i].date.toISOString().split('T')[0], // Convertir en chaîne YYYY-MM-DD
        start_hour: '09:00',
        end_date: weekendDates[i].date.toISOString().split('T')[0],
        end_hour: '18:00',
        Enterprise_id: enterpriseIds[i % enterpriseIds.length], 
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Indisponibilities', indisponibilities, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Indisponibilities', null, {});
  }
};