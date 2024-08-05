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
        as: "user",
      });
      Rating.belongsTo(models.Offer, {
        foreignKey: "Offer_id",
        as: "offer",
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
      Offer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Offer",
          key: "id",
        },
      },
      User_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Rating",
      uniqueKeys: {
        unique_rating: {
          fields: ["Offer_id", "User_id"],
        },
      },
    },
  );
  return Rating;
};
