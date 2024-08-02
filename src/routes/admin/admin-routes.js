const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");

router.use(authMiddleware.isAdmin);
router.use("/", require("./admin"));

module.exports = router;
