"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Indisponibility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Indisponibility.belongsTo(models.Enterprise, {
        foreignKey: "Enterprise_id",
      });
    }
  }
  Indisponibility.init(
    {
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
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
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          notEmpty: true,
        },
        defaultValue: sequelize.fn(
          "DATE_ADD",
          sequelize.fn("CURDATE"),
          "INTERVAL 10 YEAR",
        ),
      },
      end_hour: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          notEmpty: true,
        },
        defaultValue: "23:59",
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
      modelName: "Indisponibility",
    },
  );
  return Indisponibility;
};
