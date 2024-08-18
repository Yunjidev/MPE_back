const { sequelize } = require("../../../models/index");
const Enterprise = sequelize.models.Enterprise;
const { Job, User, Country } = require("../../../models/index");
const files = require("../../utils/files");
const {
  calculateRemainingAvailability,
  getNextAvailableDate,
} = require("../../utils/availability");
const { calculateAverageRatingForEnterprise } = require("../../utils/ratings");

exports.getAllEnterprises = async (req, res) => {
  try {
    const enterprise = await Enterprise.findAll({
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
          "city",
          "zip_code",
        ],
      },
    });
    const enterpriseWithDetails = await Promise.all(
      enterprise.map(async (enterprise) => {
        const remainingAvailability = await calculateRemainingAvailability(
          enterprise.id,
        );
        const nextAvailableDate = getNextAvailableDate(remainingAvailability);
        const averageRating = await calculateAverageRatingForEnterprise(
          enterprise.id,
        );
        const enterpriseData = enterprise.toJSON();
        if (enterpriseData.photos) {
          enterpriseData.photos = enterpriseData.photos.map((photo) => {
            return files.getUrl(req, "enterprises/photos", photo);
          });
        }
        if (enterpriseData.logo) {
          enterpriseData.logo = files.getUrl(
            req,
            "enterprises/logo",
            enterpriseData.logo,
          );
        }
        enterpriseData.nextAvailableDate = nextAvailableDate;
        enterpriseData.averageRating = averageRating;
        return enterpriseData;
      }),
    );
    res.status(200).json(enterpriseWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnterpriseById = async (req, res) => {
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
            {
              model: sequelize.models.Rating,
              as: "ratings",
              attributes: {
                exclude: ["createdAt", "updatedAt", "Enterprise_id"],
              },
              include: [
                {
                  model: sequelize.models.User,
                  as: "user",
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "password",
                      "resetPasswordToken",
                      "resetPasswordExpires",
                      "isEntrepreneur",
                      "isAdmin",
                      "firstName",
                      "lastName",
                      "email",
                    ],
                  },
                },
              ],
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
      return res.status(404).json({ message: "Pas de Enterprise trouv├®e" });
    }
    // Creations des routes avatars
    const offers = enterprise.offers;
    const reservations = enterprise.offers.map((offer) => offer.reservations);
    const ratings = enterprise.offers.map((offer) => offer.ratings).flat();
    console.log(ratings);
    const raters = ratings.map((rating) => rating.user);
    raters.forEach((rater) => {
      if (rater.avatar) {
        const avatarUrl = files.getUrl(req, "avatars", rater.avatar);
        rater.dataValues.avatar = avatarUrl;
      }
    });
    if (enterprise.entrepreneur.avatar) {
      const avatarUrl = files.getUrl(
        req,
        "avatars",
        enterprise.entrepreneur.avatar,
      );
      enterprise.entrepreneur.dataValues.avatar = avatarUrl;
    }
    const remainingAvailability = await calculateRemainingAvailability(id);
    const nextAvailableDate = getNextAvailableDate(remainingAvailability);
    const averageRating = await calculateAverageRatingForEnterprise(id);
    const enterpriseData = enterprise.toJSON();
    enterpriseData.remainingAvailability = remainingAvailability;
    enterpriseData.nextAvailableDate = nextAvailableDate;
    enterpriseData.averageRating = averageRating;
    if (enterpriseData.photos) {
      enterpriseData.photos = enterpriseData.photos.map((photo) => {
        return files.getUrl(req, "enterprises/photos", photo);
      });
    }
    if (enterpriseData.logo) {
      enterpriseData.logo = files.getUrl(
        req,
        "enterprises/logo",
        enterpriseData.logo,
      );
    }
    enterpriseData.offers.map((offer) => {
      if (offer.image) {
        offer.image = files.getUrl(req, "offers-images", offer.image);
      }
      return offer.dataValues;
    });
    if (enterpriseData.job.picture) {
      enterpriseData.job.picture = files.getUrl(
        req,
        "jobs-pictures",
        enterpriseData.job.picture,
      );
    }
    res.status(200).json(enterpriseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
