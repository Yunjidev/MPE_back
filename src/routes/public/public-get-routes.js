const express = require("express");
const router = express.Router();
// Controllers
// enterprises
const enterpriseController = require("../../controllers/enterprises/enterprises-controller");
const enterpriseValidateController = require("../../controllers/enterprises/enterprises-validate-controller");
// static
const conditionController = require("../../controllers/static/conditions-controller");
const faqController = require("../../controllers/static/faq-controller");
const pricingController = require("../../controllers/static/pricings-controller");
const teamController = require("../../controllers/static/team-controller");

// Enterprise routes
router.get(
  "/enterprises/validate",
  enterpriseValidateController.getAllEnterprisesValidate,
);
router.get(
  "/enterprise/:id",
  enterpriseValidateController.getEnterpriseByIdValidate,
);

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

module.exports = router;
