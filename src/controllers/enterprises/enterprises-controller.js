const { sequelize } = require("../../../models/index");
const Enterprise = sequelize.models.Enterprise;
const { Job, User, Country } = require("../../../models/index");
const files = require("../../utils/files");

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
      return res.status(404).json({ errors: "Pas de job trouvé" });
    }
    const country = await Country.findByPk(Country_id);
    if (!country) {
      return res.status(404).json({ errors: "Pas de Region trouvé" });
    }
    if (!req.user.firstname && !req.user.lastname) {
      return res
        .status(400)
        .json({ errors: "Veuillez renseigner votre nom et votre prénom" });
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
    let enterpriseData = {
      id: newEnterprise.id,
      name: newEnterprise.name,
      isValidate: newEnterprise.isValidate,
      logo: newEnterprise.logo,
      isValidate: newEnterprise.isValidate,
    };
    res
      .status(201)
      .json({ enterprise: enterpriseData, message: "Entreprise créée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
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
    const logo = req.files.logo ? req.files.logo[0].path : null;
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
    const enterpriseData = {
      id: enterprise.id,
      name: enterprise.name,
      logo: enterprise.logo,
      isValidate: enterprise.isValidate,
    };
    await enterprise.save();
    res
      .status(200)
      .json({ enterprise: enterpriseData, message: "Entreprise modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deleteEnterprise = async (req, res) => {
  try {
    const enterprise = req.enterprise;
    if (!enterprise) {
      return res.status(404).json({ errors: "Pas de enterprises trouvée" });
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
    res.status(500).json({ errors: error.errors });
  }
};
