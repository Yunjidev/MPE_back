const { body, validationResult } = require("express-validator");
const { sequelize } = require("../../models/index");
const User = sequelize.models.User;

const userValidationRules = (isUpdate = false) => {
  const rules = [];
  if (!isUpdate) {
    rules.push(
      body("username")
        .notEmpty()
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
        .notEmpty()
        .trim()
        .escape()
        .isEmail()
        .withMessage("Email invalide")
        .custom(async (email) => {
          const existingEmail = await User.findOne({ where: { email } });
          if (existingEmail) {
            return Promise.reject("L'email existe déjà");
          }
        }),
      body("password")
        .notEmpty()
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage("le mot de passe doit contenir au moins 6 caractères"),
    );
  } else {
    rules.push(
      body("username")
        .optional({ checkFalsy: true })
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
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isEmail()
        .withMessage("Email invalide")
        .custom(async (email) => {
          const existingEmail = await User.findOne({ where: { email } });
        }),
      body("password")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 6 })
        .withMessage("le mot de passe doit contenir au moins 6 caractères"),
      body("firstname").optional({ checkFalsy: true }).trim().escape(),
      body("lastname").optional({ checkFalsy: true }).trim().escape(),
    );
  }
  return rules;
};

module.exports = { userValidationRules };
