const { sequelize } = require("../../../models/index");
const Enterprise = sequelize.models.Enterprise;
const Subscription = sequelize.models.Subscription;
const { Job, User, Country } = require("../../../models/index");
const files = require("../../utils/files");
const { calculateAverageRatingForEnterprise } = require("../../utils/ratings");
const { getAvailabilityDates } = require("../../utils/availability");

exports.getAllEnterprisesPremium = async (req, res) => {
  try {
    const enterprise = await Subscription.findAll({
      where: { status: "active" },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "subscription_type",
          "status",
          "start_date",
          "end_date",
        ],
      },
      include: [
        {
          model: sequelize.models.Enterprise,
          as: "enterprise",
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
                  "isAdmin",
                  "firstname",
                  "lastname",
                  "email",
                ],
              },
            },
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
                    exclude: ["createdAt", "updatedAt", "Offer_id"],
                  },
                },
              ],
              attributes: {
                exclude: ["createdAt", "updatedAt", "Enterprise_id"],
              },
            },
          ],
        },
      ],
    });
    const enterpriseWithDetails = await Promise.all(
      enterprise.map(async (enterprise) => {
        if (enterprise.logo) {
          enterprise.logo = files.getUrl(
            req,
            "enterprises/logo",
            enterprise.logo,
          );
        }
        if (enterprise.job.picture) {
          enterprise.job.dataValues.picture = files.getUrl(
            req,
            "jobs-pictures/picture",
            enterprise.job.picture,
          );
        }
        if (enterprise.entrepreneur.avatar) {
          const avatarUrl = files.getUrl(
            req,
            "avatars",
            enterprise.entrepreneur.avatar,
          );
          enterprise.entrepreneur.dataValues.avatar = avatarUrl;
        }
        enterprise.offers.forEach((offer) => {
          if (offer.image) {
            offer.image = files.getUrl(req, "offer-image/image", offer.image);
          }
        });
        const averageRating = await calculateAverageRatingForEnterprise(
          enterprise.id,
        );
        const availabilityDates = getAvailabilityDates(
          enterprise.disponibilities,
          enterprise.indisponibilities,
          enterprise.offers.map((offer) => offer.reservations).flat(),
        );
        const enterpriseData = Object.assign({}, enterprise.toJSON(), {
          averageRating: averageRating,
          availabilityDates: availabilityDates,
          nextAvalaibleDate: availabilityDates[0],
        });
        return enterpriseData;
      }),
    );
    res.status(200).json(enterpriseWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
