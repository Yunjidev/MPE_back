const { sequelize } = require("../../../models/index");
const Enterprise = sequelize.models.Enterprise;
const Subscription = sequelize.models.Subscription;
const { Job, User, Country } = require("../../../models/index");
const files = require("../../utils/files");
const { calculateAverageRatingForEnterprise } = require("../../utils/ratings");
const { getAvailabilityDates } = require("../../utils/availability");

exports.getAllEnterprisesPremium = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { status: "active" },
      attributes: ["id", "Enterprise_id"],
      include: [
        {
          model: sequelize.models.Enterprise,
          as: "enterprise",
          attributes: ["id", "name", "logo", "city", "zip_code"],
          include: [
            {
              model: sequelize.models.User,
              as: "entrepreneur",
              attributes: ["id", "avatar", "username"],
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
          ],
        },
      ],
    });

    const enterpriseWithDetails = await Promise.all(
      subscriptions.map(async (subscription) => {
        const enterprise = subscription.enterprise;
        if (enterprise.logo) {
          enterprise.logo = files.getUrl(req, "enterprises/logo", enterprise.logo);
        }
        if (enterprise.job.picture) {
          enterprise.job.dataValues.picture = files.getUrl(
            req,
            "jobs/picture",
            enterprise.job.picture,
          );
        }
        if (enterprise.entrepreneur && enterprise.entrepreneur.avatar) {
          const avatarUrl = files.getUrl(req, "users/avatar", enterprise.entrepreneur.avatar);
          enterprise.entrepreneur.dataValues.avatar = avatarUrl;
        }
        const averageRating = await calculateAverageRatingForEnterprise(
          enterprise.id,
        );
        enterprise.dataValues.averageRating = averageRating;
        return enterprise;
      }),
    );

    res.status(200).json(enterpriseWithDetails);
  } catch (error) {
    console.error("Error fetching premium enterprises:", error);
    res.status(500).json({ errors: error.errors });
  }
};
