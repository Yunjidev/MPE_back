const { sequelize } = require("../../../models");

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
    res.status(200).json({ countries, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
