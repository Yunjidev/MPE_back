"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Disponibility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Disponibility.belongsTo(models.Enterprise, {
        foreignKey: "Enterprise_id",
      });
    }
  }
  Disponibility.init(
    {
      day: {
        type: DataTypes.ENUM(
          "Lundi",
          "Mardi",
          "Mercredi",
          "Jeudi",
          "Vendredi",
          "Samedi",
          "Dimanche",
        ),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      start_hour: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          notEmpty: true,
        },
      },
      end_hour: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          notEmpty: true,
        },
      },
      Enterprise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1,
          references: {
            model: "Enterprise",
            key: "id",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Disponibility",
    },
  );
  return Disponibility;
};
