"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash("admin123", 10);
    await queryInterface.bulkInsert(
      "Countries",
      [
        {
          name: "Provence-Alpes-Côte d'Azur",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pays de la Loire",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Occitanie",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Nouvelle-Aquitaine",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Normandie",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Île-de-France",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Hauts-de-France",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Grand Est",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Corse",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Centre-Val de Loire",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bretagne",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bourgogne-Franche-Comté",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Auvergne-Rhône-Alpes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Countries");
  },
};
