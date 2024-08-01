const express = require("express");
const router = express.Router();
const inDisponibilitiesController = require("../controllers/indisponibility-controller");

router.get(
  "/indisponibility",
  inDisponibilitiesController.getAllIndisponibilities,
);

router.get(
  "/indisponibility/:id",
  inDisponibilitiesController.getInDisponibilityById,
);

router.post(
  "/indisponibility",
  inDisponibilitiesController.createInDisponibility,
);

router.put(
  "/indisponibility/:id",
  inDisponibilitiesController.updateInDisponibility,
);

router.delete(
  "/indisponibility/:id",
  inDisponibilitiesController.deleteInDisponibility,
);

module.exports = router;
