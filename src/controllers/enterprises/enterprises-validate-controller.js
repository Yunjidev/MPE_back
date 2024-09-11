const { sequelize } = require("../../../models/index");
const Enterprise = sequelize.models.Enterprise;
const { Job, User, Country } = require("../../../models/index");
const files = require("../../utils/files");
const { calculateAverageRatingForEnterprise } = require("../../utils/ratings");
const { getAvailabilityDates } = require("../../utils/availability");

exports.getAllEnterprisesValidate = async (req, res) => {
  try {
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
    });
    const enterpriseWithDetails = await Promise.all(
      enterprise.map(async (enterprise) => {
        if (enterprise.logo) {
          enterprise.logo = files.getUrl(req, "enterprises/logo", enterprise.logo);
        }
        if (enterprise.job && enterprise.job.picture) {
          enterprise.job.dataValues.picture = files.getUrl(req, "jobs/picture", enterprise.job.picture);
        }
        if (enterprise.entrepreneur && enterprise.entrepreneur.avatar) {
          const avatarUrl = files.getUrl(req, "users/avatar", enterprise.entrepreneur.avatar);
          enterprise.entrepreneur.dataValues.avatar = avatarUrl;
        }
        enterprise.offers.forEach((offer) => {
          if (offer.image) {
            offer.image = files.getUrl(req, "offers/image", offer.image);
          }
        });
        const averageRating = await calculateAverageRatingForEnterprise(enterprise.id);
        const availabilityDates = getAvailabilityDates(
          enterprise.disponibilities,
          enterprise.indisponibilities,
          enterprise.offers.map((offer) => offer.reservations).flat()
        );
        const enterpriseData = Object.assign({}, enterprise.toJSON(), {
          averageRating: averageRating,
          availabilityDates: availabilityDates,
          nextAvalaibleDate: availabilityDates[0],
        });
        return enterpriseData;
      })
    );

    res.status(200).json(enterpriseWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error.message });
  }
};

exports.getEnterpriseByIdValidate = async (req, res) => {
  try {
    const { id } = req.params;
    const enterprise = await Enterprise.findByPk(id, {
      where: { isValidate: true },
      include: [
        {
          model: sequelize.models.Job,
          as: "job",
          attributes: { exclude: ["createdAt", "updatedAt"] },
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
          attributes: { exclude: ["createdAt", "updatedAt"] },
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
            {
              model: sequelize.models.Rating,
              as: "ratings",
              attributes: {
                exclude: ["updatedAt", "Enterprise_id"],
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
            exclude: ["createdAt", "updatedAt", "Enterprise_id"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "User_id", "Job_id", "Country_id"],
      },
    });
    if (!enterprise) {
      return res.status(404).json({ errors: "Pas de Enterprise trouvée" });
    }
    if (!enterprise.isValidate) {
      return res.status(404).json({ errors: "L'entreprise n'est pas validée" });
    }
    if (enterprise.logo) {
      enterprise.logo = files.getUrl(req, "enterprises/logo", enterprise.logo);
    }
    if (enterprise.photos) {
      enterprise.photos = enterprise.photos.map((photo) => {
        return files.getUrl(req, "enterprises/photos", photo);
      });
    }
    if (enterprise.job.picture) {
      enterprise.job.dataValues.picture = files.getUrl(
        req,
        "jobs/picture",
        enterprise.job.picture,
      );
    }
    // Creations des routes avatars
    const offers = enterprise.offers;
    offers.forEach((offer) => {
      if (offer.image) {
        offer.image = files.getUrl(req, "offers/image", offer.image);
      }
    });
    const reservations = enterprise.offers.map((offer) => offer.reservations);
    const ratings = enterprise.offers.map((offer) => offer.ratings).flat();
    const raters = ratings.map((rating) => rating.user);
    raters.forEach((rater) => {
      if (rater.avatar) {
        const avatarUrl = files.getUrl(req, "users/avatar", rater.avatar);
        rater.dataValues.avatar = avatarUrl;
      }
    });
    if (enterprise.entrepreneur.avatar) {
      const avatarUrl = files.getUrl(
        req,
        "users/avatar",
        enterprise.entrepreneur.avatar,
      );
      enterprise.entrepreneur.dataValues.avatar = avatarUrl;
    }
    const averageRating = await calculateAverageRatingForEnterprise(id);
    enterprise.averageRating = averageRating;
    enterprise.availabilityDates = getAvailabilityDates(
      enterprise.disponibilities,
      enterprise.indisponibilities,
      enterprise.offers.map((offer) => offer.reservations).flat(),
    );
    const enterpriseData = Object.assign({}, enterprise.toJSON(), {
      averageRating: averageRating,
      availabilityDates: enterprise.availabilityDates,
      nextAvalaibleDate: enterprise.availabilityDates[0],
    });
    res.status(200).json(enterpriseData);
  } catch (error) {
    console.error(error)
    res.status(500).json({ errors: error.message });
  }
};
