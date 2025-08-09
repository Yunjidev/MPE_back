const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");
const authController = require("../../controllers/users/auth-controller");
const files = require("../../utils/files");
const { validate } = require("../../middlewares/validations-middleware");
const { userValidationRules } = require("../../utils/uservalidationsrules");

router.post(
  "/signup",
  files.upload("users").single("avatar"),
  userValidationRules(true),
  validate,
  authController.signup,
);

router.post("/signin", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/validate-refresh-token", authController.validateRefreshToken);

// Route pour le reset password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;