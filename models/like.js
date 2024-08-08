"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Like.belongsTo(models.User, {
        foreignKey: "User_id",
        as: "user",
      });
      Like.belongsTo(models.Enterprise, {
        foreignKey: "Enterprise_id",
        as: "enterprise",
      });
    }
  }
  Like.init(
    {
      User_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      Enterprise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Enterprises",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Like",
      uniqueKeys: {
        unique_user_enterprise: {
          fields: ["User_id", "Enterprise_id"],
        },
      },
    },
  );
  return Like;
};
