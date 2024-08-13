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
      return res.status(404).json({ message: "Pas de Enterprise trouv├®e" });
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

exports.createEnterprise = async (req, res) => {
  try {
    const {
      name,
      phone,
      mail,
      adress,
      city,
      zip_code,
      siret_number,
      description,
      facebook,
      instagram,
      twitter,
      Job_id,
      Country_id,
    } = req.body;
    const photos =
      req.files && req.files.photos && req.files.photos.length > 0
        ? req.files.photos.map((file) => file.path)
        : [];
    const logo =
      req.files && req.files.logo && req.files.logo.length > 0
        ? req.files.logo[0].path
        : null;
    const job = await Job.findByPk(Job_id);
    if (!job) {
      return res.status(404).json({ message: "Pas de job trouvé" });
    }
    const country = await Country.findByPk(Country_id);
    if (!country) {
      return res.status(404).json({ message: "Pas de Region trouvé" });
    }
    if (!req.user.firstname || !req.user.lastname) {
      return res.status(400).json({ message: "Veuillez renseigner votre nom" });
    }
    const newEnterprise = await Enterprise.create({
      name,
      phone,
      mail,
      adress,
      city,
      zip_code,
      siret_number,
      description,
      facebook,
      instagram,
      twitter,
      photos,
      logo,
      User_id: req.user.id,
      Job_id,
      Country_id,
    });
    req.user.isEntrepreneur = true;
    await req.user.save();
    res.status(201).json({ message: "Entreprise créée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEnterprise = async (req, res) => {
  try {
    const {
      name,
      phone,
      mail,
      adress,
      city,
      zip_code,
      description,
      facebook,
      instagram,
      twitter,
      isValidate,
      Job_id,
      Country_id,
      removePhotos = [],
      removeLogo = [],
    } = req.body;

    // Trouver l'entreprise
    const enterprise = req.enterprise;

    // Mise � jour des informations de l'entreprise
    enterprise.name = name || enterprise.name;
    enterprise.phone = phone || enterprise.phone;
    enterprise.mail = mail || enterprise.mail;
    enterprise.adress = adress || enterprise.adress;
    enterprise.city = city || enterprise.city;
    enterprise.zip_code = zip_code || enterprise.zip_code;
    enterprise.description = description || enterprise.description;
    enterprise.facebook = facebook || enterprise.facebook;
    enterprise.instagram = instagram || enterprise.instagram;
    enterprise.twitter = twitter || enterprise.twitter;
    enterprise.Country_id = Country_id || enterprise.Country_id;
    enterprise.Job_id = Job_id || enterprise.Job_id;
    if (req.user.isAdmin) {
      enterprise.isValidate = isValidate || enterprise.isValidate;
    }
    // Gestion des nouvelles photos
    if (req.files.photos && req.files.photos.length > 0) {
      const newPhotos = req.files.photos.map((file) => file.path);
      enterprise.photos = [...enterprise.photos, ...newPhotos];
    }
    if (req.files.logo && req.files.logo.length > 0) {
      enterprise.logo = req.files.logo[0].path;
    }

    // Suppression des photos
    if (removePhotos.length > 0) {
      removePhotos.forEach((photo) => {
        const index = enterprise.photos.indexOf(photo);
        if (index > -1) {
          enterprise.photos.splice(index, 1);
          files.deleteFile(photo);
        }
      });
    }
    if (req.body.removeLogo) {
      if (enterprise.logo) {
        files.deleteFile(enterprise.logo);
        enterprise.logo = null;
      }
    }
    await enterprise.save();
    res.status(200).json({ message: "Entreprise modifiée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEnterprise = async (req, res) => {
  try {
    const enterprise = req.enterprise;
    if (!enterprise) {
      return res.status(404).json({ message: "Pas de enterprises trouvée" });
    }
    await enterprise.destroy();
    res.status(200).json({ message: "enterprises supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
