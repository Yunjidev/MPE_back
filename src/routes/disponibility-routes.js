const express = require("express");
const router = express.Router();
const disponibilitiesController = require("../controllers/disponibility-controller");

router.get("/disponibility", disponibilitiesController.getAllDisponibilities);
router.get(
  "/disponibility/:id",
  disponibilitiesController.getDisponibilityById,
);

router.post("/disponibility", disponibilitiesController.createDisponibility);
router.put("/disponibility/:id", disponibilitiesController.updateDisponibility);

router.delete(
  "/disponibility/:id",
  disponibilitiesController.deleteDisponibility,
);

module.exports = router;
