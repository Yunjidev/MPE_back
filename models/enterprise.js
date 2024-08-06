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
        allowNull: false,
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
        allowNull: false,
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
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [14, 14],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      twitter: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      photos: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue('photos');
          try {
            return rawValue ? JSON.parse(rawValue) : [];
          } catch (e) {
            console.error('Erreur lors du parsing de photos:', e);
            // Retourner une valeur par défaut ou gérer l'erreur comme vous le souhaitez
            return [];
          }
        },
        set(value) {
          this.setDataValue('photos', JSON.stringify(value));
        },
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
    },
    {
      sequelize,
      modelName: "Enterprise",
    },
  );
  return Enterprise;
};
