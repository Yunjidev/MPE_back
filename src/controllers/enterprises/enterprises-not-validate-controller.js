const { sequelize } = require("../../../models/index");
const Enterprise = sequelize.models.Enterprise;
const { Job, User, Country } = require("../../../models/index");
const files = require("../../utils/files");
const {
  calculateRemainingAvailability,
  getNextAvailableDate,
} = require("../../utils/availability");
const { calculateAverageRatingForEnterprise } = require("../../utils/ratings");

exports.getAllEnterprisesNotValidate = async (req, res) => {
  try {
    const enterprise = await Enterprise.findAll({
      where: { isValidate: false },
      attributes: {
        exclude: ["createdAt", "updatedAt", "User_id", "Job_id", "Country_id"],
      },
    });
    res.status(200).json(enterprise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnterpriseByIdNotValidate = async (req, res) => {
  try {
    const { id } = req.params;
    const enterprise = await Enterprise.findByPk(id, {
      include: [
        {
          model: sequelize.models.Job,
          as: "job",
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
        {
          model: sequelize.models.User,
          as: "entrepreneur",
          attributes: {
            exclude: [
              "id",
              "createdAt",
              "updatedAt",
              "password",
              "resetPasswordToken",
              "resetPasswordExpires",
              "isEntrepeneur",
            ],
          },
        },
        {
          model: sequelize.models.Country,
          as: "country",
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
        {
          model: sequelize.models.Disponibility,
          as: "disponibilities",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "Enterprise_id"],
          },
        },
        {
          model: sequelize.models.Indisponibility,
          as: "indisponibilities",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "Enterprise_id"],
          },
        },
        {
          model: sequelize.models.Offer,
          as: "offers",
          include: [
            {
              model: sequelize.models.Reservation,
              as: "reservations",
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "id",
                  "Offer_id",
                  "User_id",
                ],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "Enterprise_id"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "User_id", "Job_id", "Country_id"],
      },
    });
    if (!enterprise) {
      return res.status(404).json({ message: "Pas de Enterprise trouvée" });
    }
    const remainingAvailability = await calculateRemainingAvailability(id);
    const nextAvailableDate = getNextAvailableDate(remainingAvailability);
    const averageRating = await calculateAverageRatingForEnterprise(id);
    const enterpriseData = enterprise.toJSON();
    enterpriseData.remainingAvailability = remainingAvailability;
    enterpriseData.nextAvailableDate = nextAvailableDate;
    enterpriseData.averageRating = averageRating;
    res.status(200).json(enterpriseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};