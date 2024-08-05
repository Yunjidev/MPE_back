"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Ratings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      note: {
        type: Sequelize.DECIMAL,
      },
      comment: {
        type: Sequelize.STRING,
      },
      Offer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Offers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      User_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
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
    await queryInterface.addConstraint("Ratings", {
      fields: ["Offer_id", "User_id"],
      type: "unique",
      name: "unique_rating",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Ratings", "unique_rating");
    await queryInterface.dropTable("Ratings");
  },
};
