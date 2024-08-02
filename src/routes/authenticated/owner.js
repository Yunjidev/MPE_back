const express = require("express");
const router = express.Router();
// Middlewares
const { upload } = require("../../middlewares/files-middleware");
// Controllers
const authController = require("../../controllers/auth-controller");
const enterprisesController = require("../../controllers/enterprises-controller");
const subscriptionsController = require("../../controllers/subscription-controller");
const disponibilitiesController = require("../../controllers/disponibility-controller");
const inDisponibilitiesController = require("../../controllers/indisponibility-controller");
const offersController = require("../../controllers/offer-controller");

// Route Enterprise
router.delete("", enterprisesController.deleteEnterprise);

// Routes Disponibilité
router.post("/disponibility", disponibilitiesController.createDisponibility);
router.delete(
  "/disponibility/:id",
  disponibilitiesController.deleteDisponibility,
);

// Routes Indisponibilité
router.post(
  "/indisponibility",
  inDisponibilitiesController.createInDisponibility,
);
router.delete(
  "/indisponibility/:id",
  inDisponibilitiesController.deleteInDisponibility,
);

// Routes Offre
router.post("/offer", offersController.createOffer);
router.delete("/offer/:id", offersController.deleteOffer);

// Routes Subscription
router.post("/subscription", subscriptionsController.createSubscription);
router.delete("/subscription/:id", subscriptionsController.deleteSubscription);

module.exports = router;
