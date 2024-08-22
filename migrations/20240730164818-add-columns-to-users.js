"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "firstname", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "lastname", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "isEntrepreneur", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropColumn("Users", "firstname", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.dropColumn("Users", "lastname", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.dropColumn("Users", "isEntrepreneur", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
