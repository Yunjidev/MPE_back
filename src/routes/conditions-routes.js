const express = require("express");
const router = express.Router();
const conditionsController = require("../controllers/conditions-controller");

router.get("/conditions", conditionsController.getAllConditions);
router.get("/conditions/:id", conditionsController.getConditionById);

router.post("/conditions", conditionsController.createCondition);
router.put("/conditions/:id", conditionsController.updateCondition);

router.delete("/conditions/:id", conditionsController.deleteCondition);

module.exports = router;
