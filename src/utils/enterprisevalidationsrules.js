const { body } = require("express-validator");
const { sequelize } = require("../../models/index");
const Enterprise = sequelize.models.Enterprise;

const enterpriseValidationRules = (isUpdate = false) => {
  const rules = [];
  if (!isUpdate) {
    rules.push(
      body("name")
        .notEmpty()
        .withMessage("Le nom d'entreprise est obligatoire")
        .trim()
        .escape()
        .isLength({ min: 3, max: 50 })
        .withMessage(
          "Votre nom d'entreprise doit être compris entre 3 et 50 caractères",
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
        .withMessage("L'email est obligatoire")
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
        .withMessage("Le numéro de téléphone est obligatoire")
        .trim()
        .escape()
        .isLength({ min: 10 })
        .withMessage("le numéro de téléphone doit contenir 10 chiffres"),
      body("adress").bail().trim().escape(),
      body("city")
        .notEmpty()
        .withMessage("La ville est obligatoire")
        .trim()
        .escape(),
      body("zip_code")
        .notEmpty()
        .withMessage("Le code postal est obligatoire")
        .trim()
        .escape()
        .isLength({ min: 5, max: 5 }),
      body("siret_number")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 14, max: 14 }),
      body("description").bail().trim().escape(),
      body("facebook")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isURL()
        .withMessage("L'URL Facebook est invalide"),
      body("instagram")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isURL()
        .withMessage("L'URL Instagram est invalide"),
      body("twitter")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isURL()
        .withMessage("L'URL Twitter est invalide"),
    );
  } else {
    rules.push(
      body("name")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 3, max: 50 })
        .withMessage(
          "Votre nom d'entreprise doit être compris entre 3 et 50 caractères",
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
        .trim()
        .escape()
        .isLength({ min: 10 })
        .withMessage("le numéro de téléphone doit contenir 10 chiffres"),
      body("adress").optional({ checkFalsy: true }).trim().escape(),
      body("city").optional({ checkFalsy: true }).trim().escape(),
      body("zip_code")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 5, max: 5 }),
      body("siret_number")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 14, max: 14 }),
      body("description").optional({ checkFalsy: true }).bail().trim().escape(),
      body("facebook").optional({ checkFalsy: true }).trim().escape().isURL(),
      body("instagram").optional({ checkFalsy: true }).trim().escape().isURL(),
      body("twitter").optional({ checkFalsy: true }).trim().escape().isURL(),
    );
  }
  return rules;
};

module.exports = { enterpriseValidationRules };
