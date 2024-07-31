const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/job-controller");
const { upload } = require("../middlewares/files-middleware");

router.get("/job", jobsController.getAllJobs);
router.get("/job/:id", jobsController.getJobById);

router.post(
  "/job",
  upload("job-picture").single("picture"),
  jobsController.createJob,
);
router.put(
  "/job/:id",
  upload("job-picture").single("picture"),
  jobsController.updateJob,
);

router.delete("/job/:id", jobsController.deleteJob);

module.exports = router;
