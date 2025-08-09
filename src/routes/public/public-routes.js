const express = require("express");
const router = express.Router();

const publicGetRoutes = require("./public-get-routes");
router.use("/", publicGetRoutes);

const publicPostRoutes = require("./public-post-routes");
router.use("/", publicPostRoutes);

module.exports = router;