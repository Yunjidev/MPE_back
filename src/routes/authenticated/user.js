const express = require("express");
const router = express.Router();
// Middlewares
const { upload } = require("../../middlewares/files-middleware");
const validatesUsersMiddleware = require("../../middlewares/validates-users-middleware");
const authMiddleware = require("../../middlewares/auth-middleware");
// Controllers
const authController = require("../../controllers/auth-controller");
const enterprisesController = require("../../controllers/enterprises-controller");
const ratingController = require("../../controllers/rating-controller");

// Route User
router.put(
  "/users/:id",
  upload("avatars").single("avatar"),
  validatesUsersMiddleware.userValidationRules(true),
  validatesUsersMiddleware.validate,
  authController.updateUser,
);
router.post("/signout", authController.logout);
router.delete("/users/:id", authController.deleteUser);

// Routes Enterprise
router.post(
  "/enterprise",
  upload("enterprise-photos").array("photos", 5),
  enterprisesController.createEnterprise,
);

// Routes Rating
router.post("/enterprise/:id/rating", ratingController.createRating);
router.delete(
  "/rating/:id",
  authMiddleware.isOwner("Rating"),
  ratingController.deleteRating,
);

module.exports = router;
