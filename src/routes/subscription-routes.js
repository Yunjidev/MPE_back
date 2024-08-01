const express = require("express");
const router = express.Router();
const subscriptionsController = require("../controllers/subscription-controller");

router.get("/subscription", subscriptionsController.getAllSubscriptions);
router.get("/subscription/:id", subscriptionsController.getSubscriptionById);

router.post("/subscription", subscriptionsController.createSubscription);
router.put("/subscription/:id", subscriptionsController.updateSubscription);

router.delete("/subscription/:id", subscriptionsController.deleteSubscription);

module.exports = router;
