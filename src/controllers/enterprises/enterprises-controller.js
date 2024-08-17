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
    const logo =
      req.files && req.files.logo && req.files.logo.length > 0
        ? req.files.logo[0].path
        : null;
    const photos =
      req.files && req.files.photos && req.files.photos.length > 0
        ? req.files.photos.map((file) => file.path)
        : [];
    const job = await Job.findByPk(Job_id);
    if (!job) {
      return res.status(404).json({ message: "Pas de job trouvé" });
    }
    const country = await Country.findByPk(Country_id);
    if (!country) {
      return res.status(404).json({ message: "Pas de Region trouvé" });
    }
    if (!req.user.firstname && !req.user.lastname) {
      return res
        .status(400)
        .json({ message: "Veuillez renseigner votre nom et votre prénom" });
    }

    if (!req.user.isEntrepreneur) {
      req.user.isEntrepreneur = true;
      await req.user.save();
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
    res.status(201).json({ message: "Entreprise créée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEnterprise = async (req, res) => {
  try {
    const enterprise = req.enterprise;
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
      removeLogo,
      removePhotos,
    } = req.body;

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
    // Gestion du logo
    const logo = req.files.logo ? req.files.logo.path : null;
    if (logo) {
      if (enterprise.logo) {
        files.deleteFile(enterprise.logo);
      }
      enterprise.logo = logo;
    } else if (removeLogo === "true" && enterprise.logo) {
      files.deleteFile(enterprise.logo);
      enterprise.logo = null;
    }
    // Gestion des nouvelles photos
    const newPhotos = req.files.photos
      ? req.files.photos.map((file) => file.path)
      : [];
    if (newPhotos.length > 0) {
      if (enterprise.photos) {
        const maxPhotos = 3;
        const currentPhotos = enterprise.photos.length;
        if (currentPhotos + newPhotos.length > maxPhotos) {
          const photosToDeleteCount =
            currentPhotos + newPhotos.length - maxPhotos;
          const photosToDelete = enterprise.photos.slice(
            0,
            photosToDeleteCount,
          );
          photosToDelete.forEach((photo) => {
            files.deleteFile(photo);
          });
          enterprise.photos = enterprise.photos.slice(photosToDeleteCount);
        }
      }
      enterprise.photos = [...enterprise.photos, ...newPhotos];
    }
    if (removePhotos) {
      const photosToRemove = removePhotos.split(",").map(Number);
      const photosToDelete = photosToRemove.map(
        (index) => enterprise.photos[index],
      );
      enterprise.photos = enterprise.photos.filter(
        (photo, index) => !photosToRemove.includes(index),
      );
      photosToDelete.forEach((photo) => {
        if (photo) {
          files.deleteFile(photo);
        }
      });
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
    if (enterprise.logo) {
      files.deleteFile(enterprise.logo);
    }
    if (enterprise.photos) {
      enterprise.photos.forEach((photo) => {
        files.deleteFile(photo);
      });
    }
    await enterprise.destroy();
    res.status(200).json({ message: "enterprises supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
