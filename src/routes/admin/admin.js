const express = require("express");
const router = express.Router();
// Middlewares
const authMiddleware = require("../../middlewares/auth-middleware");
const files = require("../../utils/files");
// Controllers
// users
const userController = require("../../controllers/users/user-controller");
const userModerationController = require("../../controllers/users/user-moderation-controller");
// enterprises
const enterpriseController = require("../../controllers/enterprises/enterprises-controller");
const enterpriseGetController = require("../../controllers/enterprises/enterprise-get");
const enterpriseNotValidateController = require("../../controllers/enterprises/enterprises-not-validate-controller");
const disponibilityController = require("../../controllers/enterprises/disponibility-controller");
const indisponibilityController = require("../../controllers/enterprises/indisponibility-controller");
const offerController = require("../../controllers/enterprises/offer-controller");
const subscriptionsController = require("../../controllers/enterprises/subscription-controller");
// static
const conditionsController = require("../../controllers/static/conditions-controller");
const faqsController = require("../../controllers/static/faq-controller");
const countryController = require("../../controllers/static/country-controller");
const jobsController = require("../../controllers/static/job-controller");
const pricingsController = require("../../controllers/static/pricings-controller");
const teamsController = require("../../controllers/static/team-controller");
// Relations
const reservationsController = require("../../controllers/reservation-controller");
const likeController = require("../../controllers/like-controller");
const ratingController = require("../../controllers/rating-controller");

// Routes Users
router.get("/users", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);
router.put(
  "/user/:id",
  files.upload("users").single("avatar"),
  userModerationController.moderateUser,
);
router.delete("/users/:id", userModerationController.deleteUser);

// Routes Enterprise
router.get("/enterprises", enterpriseGetController.getAllEnterprises);
router.get(
  "/enterprises/not-validate",
  enterpriseNotValidateController.getAllEnterprisesNotValidate,
);
router.get("/enterprises/:id", enterpriseGetController.getEnterpriseById);

// Routes Job
router.get("/job/:id", jobsController.getJobById);
router.post(
  "/job",
  files.upload("jobs").single("picture"),
  jobsController.createJob,
);
router.put(
  "/job/:id",
  files.upload("jobs").single("picture"),
  jobsController.updateJob,
);
router.delete("/job/:id", jobsController.deleteJob);

// Routes Country
router.get("/country/:id", countryController.getCountryById);
router.post("/country", countryController.createCountry);
router.put("/country/:id", countryController.updateCountry);
router.delete("/country/:id", countryController.deleteCountry);

// disponibility routes
router.get("/disponibilities", disponibilityController.getAllDisponibilities);
router.get("/disponibility/:id", disponibilityController.getDisponibilityById);

// indisponibility routes
router.get(
  "/indisponibilities",
  indisponibilityController.getAllInDisponibilities,
);
router.get(
  "/indisponibility/:id",
  indisponibilityController.getInDisponibilityById,
);

// Routes Offer
router.get("/offers", offerController.getAllOffers);
router.get("/offer/:id", offerController.getOfferById);

// Routes Reservation
router.get("/reservation", reservationsController.getAllReservations);
router.get(
  "/reservation/:id",
  authMiddleware.isAuthorizedReservation,
  reservationsController.getReservationById,
);

// Routes Like
router.get("/likes", likeController.getAllLikes);

// Routes Subscription
router.get("/subscriptions", subscriptionsController.getAllSubscriptions);
router.get("/subscription/:id", subscriptionsController.getSubscriptionById);

// Rating routes
router.get("/ratings", ratingController.getAllRatings);
router.get("/rating/:id", ratingController.getRatingById);

// Routes Faq
router.post("/faq", faqsController.createFaq);
router.put("/faq/:id", faqsController.updateFaq);
router.delete("/faq/:id", faqsController.deleteFaq);

// Routes Pricing
router.post("/pricing", pricingsController.createPricing);
router.put("/pricing/:id", pricingsController.updatePricing);
router.delete("/pricing/:id", pricingsController.deletePricing);

// Routes Team
router.post(
  "/team",
  files.upload("teams").single("photo"),
  teamsController.createTeam,
);
router.put(
  "/team/:id",
  files.upload("teams").single("photo"),
  teamsController.updateTeam,
);
router.delete("/team/:id", teamsController.deleteTeam);

// Routes Condition
router.post("/condition", conditionsController.createCondition);
router.put("/condition/:id", conditionsController.updateCondition);
router.delete("/condition/:id", conditionsController.deleteCondition);

module.exports = router;
