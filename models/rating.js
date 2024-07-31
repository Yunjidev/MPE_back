"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rating.belongsTo(models.User, {
        foreignKey: "User_id",
      });
      Rating.belongsTo(models.Enterprise, {
        foreignKey: "Enterprise_id",
      });
    }
  }
  Rating.init(
    {
      note: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notEmpty: true,
          isDecimal: true,
          min: 0,
          max: 5,
          is: /^(\d+(?:\.\d{1,2})?|5)$/,
        },
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
      Enterprise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isInt: true,
          min: 1,
          references: {
            model: "Enterprise",
            key: "id",
          },
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
    },
    {
      sequelize,
      modelName: "Rating",
      uniqueKeys: {
        unique_rating: {
          fields: ["Enterprise_id", "User_id"],
        },
      },
    },
  );
  return Rating;
};
