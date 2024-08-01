const express = require("express");
const router = express.Router();
const pricingsController = require("../controllers/pricings-controller");

router.get("/pricings", pricingsController.getAllPricings);
router.get("/pricings/:id", pricingsController.getPricingById);

router.post("/pricings", pricingsController.createPricing);
router.put("/pricings/:id", pricingsController.updatePricing);

router.delete("/pricings/:id", pricingsController.deletePricing);

module.exports = router;
