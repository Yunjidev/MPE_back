const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/team-controller");

router.get("/team", teamsController.getAllTeams);
router.get("/team/:id", teamsController.getTeamById);

router.post("/team", teamsController.createTeam);
router.put("/team/:id", teamsController.updateTeam);

router.delete("/team/:id", teamsController.deleteTeam);

module.exports = router;
