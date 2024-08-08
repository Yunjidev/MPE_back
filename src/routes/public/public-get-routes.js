const express = require("express");
const router = express.Router();
// Controllers
const userController = require("../../controllers/user-controller");
const enterpriseController = require("../../controllers/enterprises-controller");
const jobController = require("../../controllers/job-controller");
const offerController = require("../../controllers/offer-controller");
const pricingController = require("../../controllers/pricings-controller");
const conditionController = require("../../controllers/conditions-controller");
const faqController = require("../../controllers/faq-controller");
const teamController = require("../../controllers/team-controller");
const countryController = require("../../controllers/country-controller");

// User routes
router.get("/users", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);

// Enterprise routes
router.get(
  "/enterprises/validate",
  enterpriseController.getAllEnterprisesValidate,
);
router.get("/enterprise/:id", enterpriseController.getEnterpriseById);

// Job routes
router.get("/jobs", jobController.getAllJobs);
router.get("/job/:id", jobController.getJobById);

// Offer routes
router.get("/offers", offerController.getAllOffers);
router.get("/offer/:id", offerController.getOfferById);

// Pricing routes
router.get("/pricings", pricingController.getAllPricings);
router.get("/pricing/:id", pricingController.getPricingById);

// condition routes
router.get("/conditions", conditionController.getAllConditions);
router.get("/condition/:id", conditionController.getConditionById);

// faq routes
router.get("/faqs", faqController.getAllFaqs);
router.get("/faq/:id", faqController.getFaqById);

// team routes
router.get("/teams", teamController.getAllTeams);
router.get("/team/:id", teamController.getTeamById);

// country routes
router.get("/countries", countryController.getAllCountries);
router.get("/country/:id", countryController.getCountryById);

module.exports = router;
