const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating-controller");

router.get("/rating", ratingController.getAllRatings);
router.get("/rating/:id", ratingController.getRatingById);

router.post("/rating", ratingController.createRating);

router.delete("/rating/:id", ratingController.deleteRating);

module.exports = router;
