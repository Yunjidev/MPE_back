const express = require("express");
const router = express.Router();

// User routes
const userController = require("../../controllers/user-controller");
router.get("/users", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);

// Enterprise routes
const enterpriseController = require("../../controllers/enterprises-controller");
router.get("/enterprises", enterpriseController.getAllEnterprises);
router.get("/enterprise/:id", enterpriseController.getEnterpriseById);

// Job routes
const jobController = require("../../controllers/job-controller");
router.get("/jobs", jobController.getAllJobs);
router.get("/job/:id", jobController.getJobById);

// Offer routes
const offerController = require("../../controllers/offer-controller");
router.get("/offers", offerController.getAllOffers);
router.get("/offer/:id", offerController.getOfferById);

// Pricing routes
const pricingController = require("../../controllers/pricings-controller");
router.get("/pricings", pricingController.getAllPricings);
router.get("/pricing/:id", pricingController.getPricingById);

// Rating routes
const ratingController = require("../../controllers/rating-controller");
router.get("/ratings", ratingController.getAllRatings);
router.get("/rating/:id", ratingController.getRatingById);

// condition routes
const conditionController = require("../../controllers/conditions-controller");
router.get("/conditions", conditionController.getAllConditions);
router.get("/condition/:id", conditionController.getConditionById);

// disponibility routes
const disponibilityController = require("../../controllers/disponibility-controller");
router.get("/disponibilities", disponibilityController.getAllDisponibilities);
router.get("/disponibility/:id", disponibilityController.getDisponibilityById);

// indisponibility routes
const indisponibilityController = require("../../controllers/indisponibility-controller");
router.get(
  "/indisponibilities",
  indisponibilityController.getAllInDisponibilities,
);
router.get(
  "/indisponibility/:id",
  indisponibilityController.getInDisponibilityById,
);

// faq routes
const faqController = require("../../controllers/faq-controller");
router.get("/faqs", faqController.getAllFaqs);
router.get("/faq/:id", faqController.getFaqById);

// team routes
const teamController = require("../../controllers/team-controller");
router.get("/teams", teamController.getAllTeams);
router.get("/team/:id", teamController.getTeamById);

module.exports = router;
