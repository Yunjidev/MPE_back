"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Jobs",
      [
        {
          name: "Achat / vente de voitures d'occasion",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Agence événementielle",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Agent artistique",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Agent commercial",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Agent commercial dans l'immobilier",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Agent de voyage",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Aide à domicile",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Aide ménagère",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Antiquaire",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Apporteur d'affaires",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Architecte",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Artisan d'art",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Baby-sitter",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Blogueur professionnel",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Carreleur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Chambre d'hôtes",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Chaudronnier",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Chauffeur VTC",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Coach sportif",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Coiffeur à domicile",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Commerçant ambulant",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Community Manager",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Consultant",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Consultant en ingénierie",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Consultant en référencement",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Consultant RH",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Convoyeur de véhicules",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Correcteur-relecteur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Coursier",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Couturière",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Créateur de bijoux",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Cuisinier à domicile",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Data scientist",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Décorateur d'intérieur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dépanneur informatique",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Développeur web",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Diététicien",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Disc-jockey",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Écrivain public",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Éducateur sportif",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Électricien",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Entretien de sépultures",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Esthéticienne à domicile",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fleuriste",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Formateur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Frigoriste",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Gamer / e-sport",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Graphiste",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Homme toutes mains",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Hypnotiseur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Influenceur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jardinier paysagiste",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Joueur de poker professionnel",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Journaliste, pigiste ou rédacteur web",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Livreur Amazon ou Chronopost",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Location de biens",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Maçon",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Magnétiseur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Masseur bien-être",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mécanicien",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mégissier",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Menuisier",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Moniteur d'auto-école",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Moniteur d'équitation",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Moniteur de ski",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Monteur vidéo",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Naturopathe",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Nettoyage de voitures à domicile",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ostéopathe",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Parfumeur-créateur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Parieur sportif en ligne",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Peintre en bâtiment",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Père Noël",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pet sitter",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Photographe",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pilote de drône",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Plaquiste-plâtrier",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Plombier",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Praticien Shiatsu",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Professeur à domicile",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Professeur de danse",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Professeur de yoga",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Prothésiste ongulaire",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Psychologue",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ramoneur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Restaurateur d'art",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Secrétaire à domicile",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Serrurier",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Serveur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sexothérapeute",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sophrologue",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Tatoueur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Technicien fibre optique",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Téléconseiller",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Traducteur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Transporteur de marchandises",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Voiturier",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Voyant",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Web-designer",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Wedding planner",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "YouTubeur",
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Jobs");
  },
};
