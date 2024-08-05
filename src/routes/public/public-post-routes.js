const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");
const authController = require("../../controllers/auth-controller");
const { upload } = require("../../middlewares/files-middleware");
const {
  userValidationRules,
  validate,
} = require("../../middlewares/validates-users-middleware");

router.post(
  "/signup",
  upload("avatars").single("avatar"),
  userValidationRules(false),
  validate,
  authController.signup,
);

router.post("/signin", authController.login);

// Route pour le reset password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
