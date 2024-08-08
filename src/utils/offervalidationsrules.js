const { body } = require("express-validator");
const { sequelize } = require("../../models/index");
const Enterprise = sequelize.models.Enterprise;

const offerValidationRules = () => {
  return [
    body("name")
      .bail()
      .trim()
      .escape()
      .isLength({ min: 3, max: 20 })
      .withMessage(
        "Votre nom d'offre doit être compris entre 3 et 20 caractères",
      ),
    body("description").bail().trim().escape(),
    body("price")
      .bail()
      .trim()
      .escape()
      .isNumeric()
      .withMessage("Le prix doit être un nombre"),
  ];
};

module.exports = { offerValidationRules };
