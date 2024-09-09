"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Enterprise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Enterprise.belongsTo(models.User, {
        foreignKey: "User_id",
        as: "entrepreneur",
      });
      Enterprise.belongsTo(models.Job, {
        foreignKey: "Job_id",
        as: "job",
      });
      Enterprise.belongsTo(models.Country, {
        foreignKey: "Country_id",
        as: "country",
      });
      Enterprise.hasMany(models.Disponibility, {
        foreignKey: "Enterprise_id",
        as: "disponibilities",
      });
      Enterprise.hasMany(models.Indisponibility, {
        foreignKey: "Enterprise_id",
        as: "indisponibilities",
      });
      Enterprise.hasMany(models.Offer, {
        foreignKey: "Enterprise_id",
        as: "offers",
      });
      Enterprise.hasMany(models.Subscription, {
        foreignKey: "Enterprise_id",
        as: "subscriptions",
      });
      Enterprise.hasMany(models.Like, {
        foreignKey: "Enterprise_id",
        as: "likes",
      });
    }
  }
  Enterprise.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
          len: [10, 10],
        },
      },
      mail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      adress: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
      zip_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [5, 5],
        },
      },
      siret_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
          len: [14, 14],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      twitter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photos: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("photos");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          this.setDataValue("photos", JSON.stringify(value));
        },
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isValidate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      User_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      Job_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Job",
          key: "id",
        },
      },
      Country_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Countries",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Enterprise",
    },
  );
  return Enterprise;
};
