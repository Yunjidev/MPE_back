const express = require("express");
const router = express.Router();
// Middlewares
const files = require("../../utils/files");
const authMiddleware = require("../../middlewares/auth-middleware");
const { validate } = require("../../middlewares/validations-middleware");
// Validations
const { userValidationRules } = require("../../utils/uservalidationsrules");
const {
  enterpriseValidationRules,
} = require("../../utils/enterprisevalidationsrules");
const { ratingValidationRules } = require("../../utils/ratingvalidationsrules");
// Controllers
const authController = require("../../controllers/users/auth-controller");
const enterprisesController = require("../../controllers/enterprises/enterprises-controller");
const ratingController = require("../../controllers/rating-controller");
const reservationsController = require("../../controllers/reservation-controller");
const likeController = require("../../controllers/like-controller");

// Route User
router.put(
  "/users/:id",
  files.upload("avatars").single("avatar"),
  authMiddleware.isOwner("User"),
  userValidationRules(true),
  validate,
  authController.updateUser,
);
router.post("/signout", authController.logout);
router.delete("/users/:id", authController.deleteUser);

// Routes Enterprise
const uploadFiles = files.upload("enterprise").fields([
  { name: "photos", maxCount: 3 },
  { name: "logo", maxCount: 1 },
]);

router.post(
  "/enterprise",
  uploadFiles,
  enterpriseValidationRules(),
  validate,
  enterprisesController.createEnterprise,
);

// Routes Rating
router.post(
  "/offer/:id/rating",
  ratingValidationRules(),
  validate,
  ratingController.createRating,
);
router.delete(
  "/rating/:id",
  authMiddleware.isOwner("Rating"),
  ratingController.deleteRating,
);

// Routes Reservation
router.post("/offer/:id/reservation", reservationsController.createReservation);
router.put(
  "/reservation/:id",
  authMiddleware.isAuthorizedReservation,
  reservationsController.updateReservation,
);

// Routes Like
router.get("/likes", likeController.getLikes);
router.post("/like", likeController.createLike);
router.delete("/like", likeController.deleteLike);

module.exports = router;
