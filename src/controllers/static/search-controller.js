const { sequelize } = require("../../../models");
const files = require("../../utils/files");

exports.search = async (req, res) => {
  try {
    const [countries, jobs] = await Promise.all([
      sequelize.models.Country.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      }),
      sequelize.models.Job.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      }),
    ]);
    jobs.map((job) => {
      if (job.picture) {
        job.dataValues.picture = files.getUrl(
          req,
          "jobs-pictures",
          job.picture,
        );
      }
      return job.dataValues;
    });
    res.status(200).json({ countries, jobs });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
