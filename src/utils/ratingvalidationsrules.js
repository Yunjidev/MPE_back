const { body, validationResult } = require("express-validator");
const { sequelize } = require("../../models/index");
const User = sequelize.models.User;

const ratingValidationRules = () => {
  return [
    body("note").isInt().bail().trim().escape(),
    body("comment").bail().trim().escape(),
  ];
};

module.exports = { ratingValidationRules };
