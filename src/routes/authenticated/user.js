const express = require("express");
const router = express.Router();
// Middlewares
const files = require("../../utils/files");
const validatesUsersMiddleware = require("../../middlewares/validates-users-middleware");
const authMiddleware = require("../../middlewares/auth-middleware");
// Controllers
const authController = require("../../controllers/auth-controller");
const enterprisesController = require("../../controllers/enterprises-controller");
const ratingController = require("../../controllers/rating-controller");
const reservationsController = require("../../controllers/reservation-controller");

// Route User
router.put(
  "/users/:id",
  files.upload("avatars").single("avatar"),
  authMiddleware.isOwner("User"),
  validatesUsersMiddleware.userValidationRules(true),
  validatesUsersMiddleware.validate,
  authController.updateUser,
);
router.post("/signout", authController.logout);
router.delete("/users/:id", authController.deleteUser);

// Routes Enterprise
const uploadFiles = files.upload("enterprise").fields([
  { name: "photos", maxCount: 3 },
  { name: "logo", maxCount: 1 },
]);

router.post("/enterprise", uploadFiles, enterprisesController.createEnterprise);

// Routes Rating
router.post("/offer/:id/rating", ratingController.createRating);
router.delete(
  "/rating/:id",
  authMiddleware.isOwner("Rating"),
  ratingController.deleteRating,
);

// Routes Reservation
router.get(
  "/reservation/:id",
  authMiddleware.isAuthorizedReservation,
  reservationsController.getReservationById,
);
router.post("/offer/:id/reservation", reservationsController.createReservation);
router.put(
  "/reservation/:id",
  authMiddleware.isAuthorizedReservation,
  reservationsController.updateReservation,
);

module.exports = router;
