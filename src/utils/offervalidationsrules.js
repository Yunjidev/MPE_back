const { body } = require("express-validator");
const { sequelize } = require("../../models/index");
const Enterprise = sequelize.models.Enterprise;

const offerValidationRules = (isUpdate = false) => {
  const rules = [];
  if (!isUpdate) {
    rules.push(
      body("name")
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 3, max: 20 })
        .withMessage(
          "Votre nom d'offre doit être compris entre 3 et 20 caractères",
        ),
      body("description").bail().trim().escape(),
      body("price")
        .trim()
        .isNumeric()
        .withMessage("Le prix doit être un nombre"),
    );
  } else {
    rules.push(
      body("name")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 3, max: 20 })
        .withMessage(
          "Votre nom d'offre doit être compris entre 3 et 20 caractères",
        ),
      body("description").optional({ checkFalsy: true }).trim().escape(),
      body("price")
        .optional({ checkFalsy: true })
        .trim()
        .isNumeric()
        .withMessage("Le prix doit être un nombre"),
    );
  }
  return rules;
};

module.exports = { offerValidationRules };
