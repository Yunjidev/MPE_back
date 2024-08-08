const { sequelize } = require("../../models/index");
const Job = sequelize.models.Job;
const files = require("../utils/files");

exports.getAllJobs = async (req, res) => {
  try {
    const job = await Job.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    if (!job) {
      return res.status(404).json({ message: "Pas de job trouvée" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { name } = req.body;
    const picture = req.file ? req.file.path : null;
    const newJob = await Job.create({ name, picture });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, removePicture } = req.body;
    const picture = req.file ? req.file.path : null;
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "Pas de job trouvée" });
    }
    job.name = name || job.name;
    if (picture) {
      if (job.picture) {
        files.deleteFile(job.picture);
      }
      job.picture = picture;
    } else if (removePicture === "true" && job.picture) {
      files.deleteFile(job.picture);
      job.picture = null;
    }
    await job.save();
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "Pas de job trouvée" });
    }
    await job.destroy();
    res.status(200).json({ message: "job supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
