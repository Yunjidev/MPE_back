const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const {
  userValidationRules,
  validate,
} = require("../middlewares/validates-users-middleware");
const { upload } = require("../middlewares/files-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

// Route pour s'enregistrer
router.post(
  "/signup",
  upload("avatars").single("avatar"),
  userValidationRules(false),
  validate,
  authController.signup,
);

// Route pour se connecter
router.post("/login", authController.login);

// Route pour la deconnexion
router.post("/logout", authMiddleware, authController.logout);

// Route pour l'update
router.put(
  "/users/:id",
  upload("avatars").single("avatar"),
  authMiddleware,
  userValidationRules(true),
  validate,
  authController.updateUser,
);

// Route pour la suppression
router.delete("/users/:id", authMiddleware, authController.deleteUser);

// Route pour le reset password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
