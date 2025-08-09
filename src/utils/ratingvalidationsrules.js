const { body, validationResult } = require("express-validator");
const { sequelize } = require("../../models/index");
const User = sequelize.models.User;

const ratingValidationRules = () => {
  return [body("note").isInt().trim().escape(), body("comment").trim()];
};

module.exports = { ratingValidationRules };
