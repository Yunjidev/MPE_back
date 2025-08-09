"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conditions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Conditions.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        vaalidate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Conditions",
    },
  );
  return Conditions;
};
