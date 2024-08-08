const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");
const files = require("../../utils/files");
// Controllers
const faqsController = require("../../controllers/faq-controller");
const jobsController = require("../../controllers/job-controller");
const pricingsController = require("../../controllers/pricings-controller");
const conditionsController = require("../../controllers/conditions-controller");
const teamsController = require("../../controllers/team-controller");
const reservationsController = require("../../controllers/reservation-controller");
const countryController = require("../../controllers/country-controller");
const userController = require("../../controllers/user-controller");
const enterpriseController = require("../../controllers/enterprises-controller");

// Routes Users
router.get("/users", userController.getAllUsers);

// Routes Enterprise
router.get(
  "/enterprises/not-validate",
  enterpriseController.getAllEnterprisesNotValidate,
);
// Routes Job
router.post(
  "/job",
  files.upload("job-picture").single("picture"),
  jobsController.createJob,
);
router.put(
  "/job/:id",
  files.upload("job-picture").single("picture"),
  jobsController.updateJob,
);
router.delete("/job/:id", jobsController.deleteJob);

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
  files.upload("team-photo").single("photo"),
  teamsController.createTeam,
);
router.put(
  "/team/:id",
  files.upload("team-photo").single("photo"),
  teamsController.updateTeam,
);
router.delete("/team/:id", teamsController.deleteTeam);

// Routes Condition
router.post("/condition", conditionsController.createCondition);
router.put("/condition/:id", conditionsController.updateCondition);
router.delete("/condition/:id", conditionsController.deleteCondition);

// Routes Reservation
router.get("/reservation", reservationsController.getAllReservations);

// Routes Country
router.post("/country", countryController.createCountry);
router.put("/country/:id", countryController.updateCountry);
router.delete("/country/:id", countryController.deleteCountry);

module.exports = router;
