"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Offer.belongsTo(models.Enterprise, {
        foreignKey: "Enterprise_id",
        as: "enterprise",
      });
      Offer.hasMany(models.Reservation, {
        foreignKey: "Offer_id",
        as: "reservations",
      });
      Offer.hasMany(models.Rating, {
        foreignKey: "Offer_id",
        as: "ratings",
      });
    }
  }
  Offer.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        validate: {
          isDecimal: true,
        },
      },
      estimate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      modelName: "Offer",
    },
  );
  return Offer;
};
