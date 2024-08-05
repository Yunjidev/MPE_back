const express = require("express");
const router = express.Router();
// Middlewares
const fileMiddleware = require("../../middlewares/files-middleware");
const authMiddleware = require("../../middlewares/auth-middleware");
// Controllers
const genericController = require("../../controllers/generic-controller");

// Route Enterprise
router.put(
  "",
  fileMiddleware.upload("enterprise-photos").array("photos", 5),
  authMiddleware.isEnterpriseOwnerUpdate("Enterprise"),
  genericController.updateResource,
);

// Update disponibilité
router.use(
  "/disponibility/:id",
  authMiddleware.isEnterpriseOwnerUpdate("Disponibility"),
  genericController.updateResource,
);

// Update indisponibilité
router.use(
  "/indisponibility/:id",
  authMiddleware.isEnterpriseOwnerUpdate("Indisponibility"),
  genericController.updateResource,
);

// Update offre
router.use(
  "/offer/:id",
  fileMiddleware.upload("offer-image").single("image"),
  authMiddleware.isEnterpriseOwnerUpdate("Offer"),
  genericController.updateResource,
);

// Update subscription
router.use(
  "/subscription/:id",
  authMiddleware.isEnterpriseOwnerUpdate("Subscription"),
  genericController.updateResource,
);

module.exports = router;
