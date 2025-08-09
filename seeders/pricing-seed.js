"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Pricings",
      [
        {
          offre: "Basique",
          description:
            "Découvrez notre solution basique pour faire connaître votre entreprise",
          price: 0,
          features: [
            "Possibilité de créer son entreprise",
            "Page d'entreprise",
            "Statistiques détaillées",
            "Dashboard entreprise",
          ],
          isMostPopular: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          offre: "Mensuel",
          description:
            "Profitez de notre solution mensuelle pour profiter de plus de services.",
          price: 35,
          isMostPopular: true,
          features: [
            "Possibilité de créer son entreprise",
            "Page d'entreprise",
            "Statistiques détaillées",
            "Dashboard entreprise",
            "Mise en avant sur l'accueil",
            "Priorisation dans les recherches",
            "Certification Premium",
            "Galerie Photo",
            "Calendrier + Réservations",
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          offre: "Annuel",
          description:
            "Optez pour notre solution annuelle pour avoir 2 mois offerts.",
          price: 350,
          isMostPopular: false,
          features: [
            "Possibilité de créerer son entreprise",
            "Page d'entreprise",
            "Statistiques détaillées",
            "Dashboard entreprise",
            "Mise en avant sur l'accueil",
            "Priorisation dans les recherches",
            "Certification Premium",
            "Galerie Photo",
            "Calendrier + Réservations",
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Pricings");
  },
};
