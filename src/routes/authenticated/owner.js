const express = require("express");
const router = express.Router();
// Middlewares
const files = require("../../utils/files");
const { validate } = require("../../middlewares/validations-middleware");
// validations
const {
  enterpriseValidationRules,
} = require("../../utils/enterprisevalidationsrules");
const { offerValidationRules } = require("../../utils/offervalidationsrules");
// Controllers
// users
const authController = require("../../controllers/users/auth-controller");
// enterprises
const enterprisesController = require("../../controllers/enterprises/enterprises-controller");
const disponibilitiesController = require("../../controllers/enterprises/disponibility-controller");
const inDisponibilitiesController = require("../../controllers/enterprises/indisponibility-controller");
const offersController = require("../../controllers/enterprises/offer-controller");
const subscriptionsController = require("../../controllers/enterprises/subscription-controller");
const reservationsController = require("../../controllers/reservation-controller");
const likeController = require("../../controllers/like-controller");

// Route Enterprise
const uploadFiles = files.upload("enterprises").fields([
  { name: "photos", maxCount: 3, folder: "photos" },
  { name: "logo", maxCount: 1, folder: "logo" },
]);

router.put(
  "/",
  uploadFiles,
  enterpriseValidationRules(true),
  validate,
  enterprisesController.updateEnterprise,
);
router.delete("/", enterprisesController.deleteEnterprise);

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
router.get("/offers", offersController.getOfferByEnterpriseId);
router.post(
  "/offer",
  files.upload("offers").single("image"),
  offerValidationRules(),
  validate,
  offersController.createOffer,
);
router.put(
  "/offer/:id",
  files.upload("offers").single("image"),
  offerValidationRules(true),
  validate,
  offersController.updateOffer,
);
router.delete("/offer/:id", offersController.deleteOffer);

// Routes Subscription
router.post("/subscription", subscriptionsController.createSubscription);
router.use("/subscription/:id", subscriptionsController.updateSubscription);
router.delete("/subscription/:id", subscriptionsController.deleteSubscription);

// Routes Reservation
router.get(
  "/reservations",
  reservationsController.getReservationsByEnterpriseId,
);

// Routes Like
router.get("/enterprises/:id/likes", likeController.getLikeByEnterpriseId);

module.exports = router;