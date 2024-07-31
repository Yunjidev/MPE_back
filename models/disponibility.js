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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [
            [
              "Lundi",
              "Mardi",
              "Mercredi",
              "Jeudi",
              "Vendredi",
              "Samedi",
              "Dimanche",
            ],
          ],
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
        references: {
          model: "Enterprise",
          key: "id",
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
