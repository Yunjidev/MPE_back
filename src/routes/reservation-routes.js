const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservation-controller");
const { updateResource } = require("../controllers/generic-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/reservation", reservationsController.getAllReservations);
router.get("/reservation/:id", reservationsController.getReservationById);

// Gestion des routes authentifiées
router.use(authMiddleware.isAuthenticated);

router.post(
  "offer/:id/reservation",
  authMiddleware.isOwner(),
  reservationsController.createReservation,
);

router.put(
  "/reservation/:id",
  authMiddleware.isOwnerUpdate("Reservation"),
  reservationsController.updateReservation,
);

router.delete(
  "/reservation/:id",
  authMiddleware.isOwnerUpdate("Reservation"),
  reservationsController.deleteReservation,
);

module.exports = router;
