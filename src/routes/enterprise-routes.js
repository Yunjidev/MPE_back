const express = require("express");
const router = express.Router();
const enterprisesController = require("../controllers/enterprises-controller");
const { upload } = require("../middlewares/files-middleware");

router.get("/enterprises", enterprisesController.getAllEnterprises);
router.get("/enterprises/:id", enterprisesController.getEnterpriseById);

router.post(
  "/enterprises",
  upload("enterprise-photos").array("photos", 5),
  enterprisesController.createEnterprise,
);
router.put(
  "/enterprises/:id",
  upload("enterprise-photos").array("photos"),
  enterprisesController.updateEnterprise,
);

router.delete("/enterprises/:id", enterprisesController.deleteEnterprise);

module.exports = router;
