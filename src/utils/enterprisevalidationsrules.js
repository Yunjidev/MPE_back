const { body } = require("express-validator");
const { sequelize } = require("../../models/index");
const Enterprise = sequelize.models.Enterprise;

const enterpriseValidationRules = (isUpdate = false) => {
  const rules = [];
  if (!isUpdate) {
    rules.push(
      body("name")
        .notEmpty()
        .bail()
        .trim()
        .escape()
        .isLength({ min: 3, max: 20 })
        .withMessage(
          "Votre nom d'entreprise doit être compris entre 3 et 20 caractères",
        )
        .custom(async (name) => {
          const existingEnterprise = await Enterprise.findOne({
            where: { name },
          });
          if (existingEnterprise) {
            return Promise.reject("Le nom d'entreprise existe déjà");
          }
        }),
      body("mail")
        .notEmpty()
        .bail()
        .trim()
        .escape()
        .isEmail()
        .withMessage("Email invalide")
        .custom(async (mail) => {
          const existingEmail = await Enterprise.findOne({ where: { mail } });
          if (existingEmail) {
            return Promise.reject("L'email existe déjà");
          }
        }),
      body("phone")
        .notEmpty()
        .bail()
        .trim()
        .escape()
        .isLength({ min: 10 })
        .withMessage("le numéro de téléphone doit contenir 10 chiffres"),
      body("adress").bail().trim().escape(),
      body("city").notEmpty().bail().trim().escape(),
      body("zip_code")
        .notEmpty()
        .bail()
        .trim()
        .escape()
        .isLength({ min: 5, max: 5 }),
      body("siret_number")
        .bail()
        .trim()
        .escape()
        .isLength({ min: 14, max: 14 }),
      body("description").bail().trim().escape(),
      body("facebook").bail().trim().escape().isURL(),
      body("instagram").bail().trim().escape().isURL(),
      body("twitter").bail().trim().escape().isURL(),
    );
  } else {
    rules.push(
      body("name")
        .optional({ checkFalsy: true })
        .bail()
        .trim()
        .escape()
        .isLength({ min: 3, max: 20 })
        .withMessage(
          "Votre nom d'entreprise doit être compris entre 3 et 20 caractères",
        )
        .custom(async (name) => {
          const existingEnterprise = await Enterprise.findOne({
            where: { name },
          });
          if (existingEnterprise) {
            return Promise.reject("Le nom d'entreprise existe déjà");
          }
        }),
      body("mail")
        .optional({ checkFalsy: true })
        .bail()
        .trim()
        .escape()
        .isEmail()
        .withMessage("Email invalide")
        .custom(async (mail) => {
          const existingEmail = await Enterprise.findOne({ where: { mail } });
          if (existingEmail) {
            return Promise.reject("L'email existe déjà");
          }
        }),
      body("phone")
        .optional({ checkFalsy: true })
        .bail()
        .trim()
        .escape()
        .isLength({ min: 10 })
        .withMessage("le numéro de téléphone doit contenir 10 chiffres"),
      body("adress").optional({ checkFalsy: true }).bail().trim().escape(),
      body("city").optional({ checkFalsy: true }).bail().trim().escape(),
      body("zip_code")
        .optional({ checkFalsy: true })
        .bail()
        .trim()
        .escape()
        .isLength({ min: 5, max: 5 }),
      body("siret_number")
        .optional({ checkFalsy: true })
        .bail()
        .trim()
        .escape()
        .isLength({ min: 14, max: 14 }),
      body("description").optional({ checkFalsy: true }).bail().trim().escape(),
      body("facebook")
        .optional({ checkFalsy: true })
        .bail()
        .trim()
        .escape()
        .isURL(),
      body("instagram")
        .optional({ checkFalsy: true })
        .bail()
        .trim()
        .escape()
        .isURL(),
      body("twitter")
        .optional({ checkFalsy: true })
        .bail()
        .trim()
        .escape()
        .isURL(),
    );
  }
  return rules;
};

module.exports = { enterpriseValidationRules };
