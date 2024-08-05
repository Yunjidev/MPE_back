const express = require("express");
const router = express.Router();
// Middlewares
const { upload } = require("../../middlewares/files-middleware");
const fileMiddleware = require("../../middlewares/files-middleware");
// Controllers
const authController = require("../../controllers/auth-controller");
const enterprisesController = require("../../controllers/enterprises-controller");
const subscriptionsController = require("../../controllers/subscription-controller");
const disponibilitiesController = require("../../controllers/disponibility-controller");
const inDisponibilitiesController = require("../../controllers/indisponibility-controller");
const offersController = require("../../controllers/offer-controller");

// Route Enterprise
router.put(
  "/",
  fileMiddleware.upload("enterprise-photos").array("photos", 5),
  enterprisesController.updateEnterprise,
);
router.delete("", enterprisesController.deleteEnterprise);

// Routes Disponibilité
router.post("/disponibility", disponibilitiesController.createDisponibility);
router.use("/disponibility/:id", disponibilitiesController.updateDisponibility);
router.delete(
  "/disponibility/:id",
  disponibilitiesController.deleteDisponibility,
);

// Routes Indisponibilité
router.post(
  "/indisponibility",
  inDisponibilitiesController.createInDisponibility,
);
router.use(
  "/indisponibility/:id",
  inDisponibilitiesController.updateInDisponibility,
);
router.delete(
  "/indisponibility/:id",
  inDisponibilitiesController.deleteInDisponibility,
);

// Routes Offre
router.post(
  "/offer",
  upload("offer-image").single("image"),
  offersController.createOffer,
);
router.use(
  "/offer/:id",
  fileMiddleware.upload("offer-image").single("image"),
  offersController.updateOffer,
);
router.delete("/offer/:id", offersController.deleteOffer);

// Routes Subscription
router.post("/subscription", subscriptionsController.createSubscription);
router.use("/subscription/:id", subscriptionsController.updateSubscription);
router.delete("/subscription/:id", subscriptionsController.deleteSubscription);

module.exports = router;
