const { sequelize } = require("../../../models/index");
const Enterprise = sequelize.models.Enterprise;
const { Job, User, Country } = require("../../../models/index");
const files = require("../../utils/files");
const { calculateAverageRatingForEnterprise } = require("../../utils/ratings");
const { getAvailabilityDates } = require("../../utils/availability");
const { Op } = require("sequelize");

exports.getEnterprisesNearby = async (req, res) => {
  let { lat, lng, dist } = req.query; // radius en kilomètres
  console.log(`Latitude: ${lat}, Longitude: ${lng}, Radius: ${dist}`);
  // Convertir radius en nombre et fournir une valeur par défaut si nécessaire
  let radius = parseInt(dist, 10) || 10;

  // Vérifier si lat et lng sont présents
  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude et longitude sont nécessaires." });
  }

  // Vérifier si radius est dans la plage autorisée (0 à 1500 km)
  if (isNaN(radius) || radius < 0 || radius > 1500) {
    return res.status(400).json({ message: "La distance doit être comprise entre 0 et 1500 kilomètres." });
  }

  try {
    // Assurez-vous que l'extension 'earthdistance' est installée et que les colonnes 'latitude' et 'longitude' existent
    const enterprisesNearby = await Enterprise.findAll({
      where: sequelize.where(
        sequelize.fn(
          'earth_distance',
          sequelize.fn('ll_to_earth', lat, lng),
          sequelize.fn('ll_to_earth', sequelize.col('latitude'), sequelize.col('longitude'))
        ),
        { [Op.lte]: radius * 1000 } // Convertissez le rayon en mètres
      ),
      
      
    });
    
    res.status(200).json(enterprisesNearby);
  } catch (error) {
    console.error('Error fetching nearby enterprises:', error);
    res.status(500).json({ message: 'An error occurred while fetching nearby enterprises.', error: error.toString() });
  }
};

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
    console.log(`Found ${enterprise.length} validated enterprises`);

    const enterpriseWithDetails = await Promise.all(
      enterprise.map(async (enterprise) => {
        try {
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
            nextAvailableDate: availabilityDates[0],
          });
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
      where: { isValidate: true },
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
      return res.status(404).json({ message: "Pas de Enterprise trouvée" });
    }
    if (!enterprise.isValidate) {
      return res
        .status(404)
        .json({ message: "L'entreprise n'est pas validée" });
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
        "jobs-pictures/picture",
        enterprise.job.picture,
      );
    }
    // Creations des routes avatars
    const offers = enterprise.offers;
    offers.forEach((offer) => {
      if (offer.image) {
        offer.image = files.getUrl(req, "offer-image/image", offer.image);
      }
    });
    const reservations = enterprise.offers.map((offer) => offer.reservations);
    const ratings = enterprise.offers.map((offer) => offer.ratings).flat();
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
      nextAvailableDate: enterprise.availabilityDates[0],
    });
    res.status(200).json(enterpriseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
