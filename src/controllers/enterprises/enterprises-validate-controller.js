const { sequelize } = require("../../../models/index");
const Enterprise = sequelize.models.Enterprise;
const { Job, User, Country } = require("../../../models/index");
const files = require("../../utils/files");
const {
  calculateRemainingAvailability,
  getNextAvailableDate,
} = require("../../utils/availability");
const { calculateAverageRatingForEnterprise } = require("../../utils/ratings");

exports.getAllEnterprisesValidate = async (req, res) => {
  try {
    console.log('Fetching all validated enterprises...');
    const enterprise = await Enterprise.findAll({
      where: { isValidate: true },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "User_id",
          "Job_id",
          "Country_id",
          "photos",
          "facebook",
          "instagram",
          "twitter",
          "description",
          "isValidate",
          "phone",
          "mail",
          "adress",
          "siret_number",
        ],
      },
      include: [
        {
          model: sequelize.models.Job,
          as: "job",
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
        {
          model: sequelize.models.Country,
          as: "country",
          attributes: { exclude: ["createdAt", "updatedAt", "id"] },
        },
      ],
    });
    console.log(`Found ${enterprise.length} validated enterprises`);

    const enterpriseWithDetails = await Promise.all(
      enterprise.map(async (enterprise) => {
        try{
        console.log(`Processing enterprise ID: ${enterprise.id}`);
        const remainingAvailability = await calculateRemainingAvailability(
          enterprise.id,
        );
        const nextAvailableDate = getNextAvailableDate(remainingAvailability);
        const averageRating = await calculateAverageRatingForEnterprise(
          enterprise.id,
        );
        const enterpriseData = enterprise.toJSON();
        enterpriseData.nextAvailableDate = nextAvailableDate;
        enterpriseData.averageRating = averageRating;
        console.log(`Processed enterprise ID: ${enterprise.id}`);
        return enterpriseData;
      } catch (error) {
        console.error(`Error processing enterprise ID: ${enterprise.id}:`, error);
        // Vous pouvez décider de renvoyer une partie des données, ou de sauter cette entreprise.
        return null; // ou {} pour un objet vide si cela a du sens pour votre application
      }
    }));
    console.log('Sending response with detailed enterprises');
    res.status(200).json(enterpriseWithDetails.filter(e => e)); // Filtrer les valeurs null si nécessaire
  } catch (error) {
    console.error('Error in getAllEnterprisesValidate:', error);
    res.status(500).json({ message: 'An error occurred while fetching validated enterprises.' });
  }
};


exports.getEnterpriseByIdValidate = async (req, res) => {
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
              "createdAt",
              "updatedAt",
              "password",
              "resetPasswordToken",
              "resetPasswordExpires",
              "isEntrepreneur",
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
    if (!enterprise.isValidate) {
      return res
        .status(404)
        .json({ message: "L'entreprise n'est pas validée" });
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
