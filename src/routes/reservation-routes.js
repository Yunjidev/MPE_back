const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservation-controller");

router.get("/reservation", reservationsController.getAllReservations);
router.get("/reservation/:id", reservationsController.getReservationById);

router.post("/reservation", reservationsController.createReservation);
router.put("/reservation/:id", reservationsController.updateReservation);

router.delete("/reservation/:id", reservationsController.deleteReservation);

module.exports = router;
