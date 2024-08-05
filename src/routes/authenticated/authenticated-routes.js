const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");

// Appliquer l'authentification
router.use(authMiddleware.isAuthenticated);
// Routes pour les utilisateurs
router.use("/", require("./user"));
// Routes verification propriétaire de l'entreprise
router.use(
  "/enterprise/:id",
  authMiddleware.isEnterpriseOwner(),
  require("./owner"),
);
// Routes update avec verification propriétaire de l'entreprise
router.use("/enterprise/:id", require("./owner-update"));

module.exports = router;
