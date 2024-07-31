"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reservation.belongsTo(models.Offer, {
        foreignKey: "Offer_id",
      });
      Reservation.belongsTo(models.User, {
        foreignKey: "User_id",
      });
    }
  }
  Reservation.init(
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "accepted",
          "rejected",
          "done",
          "cancelled",
        ),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      User_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
          min: 1,
          references: {
            model: "User",
            key: "id",
          },
        },
      },
      Offer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
          min: 1,
          references: {
            model: "Offer",
            key: "id",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Reservation",
      uniqueKeys: {
        unique_reservation: {
          fields: ["date", "Offer_id"],
        },
        unique_user_reservation: {
          fields: ["User_id", "date"],
        },
      },
    },
  );
  return Reservation;
};
