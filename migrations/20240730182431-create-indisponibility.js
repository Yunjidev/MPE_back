"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Indisponibilities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      start_hour: {
        type: Sequelize.STRING,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      end_hour: {
        type: Sequelize.STRING,
      },
      Enterprise_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Enterprises",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Indisponibilities");
  },
};
