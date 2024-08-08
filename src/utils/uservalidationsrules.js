const { body, validationResult } = require("express-validator");
const { sequelize } = require("../../models/index");
const User = sequelize.models.User;

const userValidationRules = () => {
  return [
    body("username")
      .bail()
      .trim()
      .escape()
      .isLength({ min: 3, max: 20 })
      .withMessage(
        "Votre nom d'utilisateur doit être compris entre 3 et 20 caractères",
      )
      .custom(async (username) => {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return Promise.reject("Le nom d'utilisateur existe déjà");
        }
      }),

    body("email")
      .bail()
      .trim()
      .escape()
      .isEmail()
      .withMessage("Email invalide")
      .custom(async (email) => {
        const existingEmail = await User.findOne({ where: { email } });
      }),
    body("password")
      .bail()
      .trim()
      .escape()
      .isLength({ min: 6 })
      .withMessage("le mot de passe doit contenir au moins 6 caractères"),
    body("firstname").bail().trim().escape(),
    body("lastname").bail().trim().escape(),
  ];
};

module.exports = { userValidationRules };
