const express = require("express");
const router = express.Router();
const offersController = require("../controllers/offer-controller");
const { upload } = require("../middlewares/files-middleware");

router.get("/offer", offersController.getAllOffers);
router.get("/offer/:id", offersController.getOfferById);

router.post(
  "/offer",
  upload("offer-image").single("image"),
  offersController.createOffer,
);
router.put(
  "/offer/:id",
  upload("offer-image").single("image"),
  offersController.updateOffer,
);

router.delete("/offer/:id", offersController.deleteOffer);

module.exports = router;
