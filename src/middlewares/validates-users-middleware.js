const { body, validationResult } = require("express-validator");
const { sequelize } = require("../../models/index");
const User = sequelize.models.User;

const userValidationRules = (isUpdate = false) => {
  return [
    body("username")
      .if(() => !isUpdate || (isUpdate && typeof body.username !== "undefined"))
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters")
      .custom(async (username) => {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
          return Promise.reject("Username already exists");
        }
      }),
    body("email")
      .if(() => !isUpdate || (isUpdate && typeof body.email !== "undefined"))
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid")
      .custom(async (email) => {
        const existingEmail = await User.findOne({ where: { email } });
      }),
    body("password")
      .if(() => !isUpdate || (isUpdate && typeof body.password !== "undefined"))
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({ errors: extractedErrors });
};

module.exports = { userValidationRules, validate };
