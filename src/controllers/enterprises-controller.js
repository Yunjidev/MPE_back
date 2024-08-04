const { sequelize } = require("../../models/index");
const Enterprise = sequelize.models.Enterprise;
const { Job, User } = require("../../models/index");
const { deleteFile } = require("../middlewares/files-middleware");
const { calculateRemainingAvailability } = require("../utils/availability");

exports.getAllEnterprises = async (req, res) => {
  try {
    const enterprise = await Enterprise.findAll();
    res.status(200).json(enterprise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEnterpriseById = async (req, res) => {
  try {
    const { id } = req.params;
    const remainingAvailability = await calculateRemainingAvailability(id);
    const enterprise = await Enterprise.findByPk(id, {
      include: [
        "job",
        "entrepreneur",
        "disponibilities",
        "indisponibilities",
        "ratings",
        {
          model: sequelize.models.Offer,
          as: "offers",
          include: [
            {
              model: sequelize.models.Reservation,
              as: "reservations",
            },
          ],
        },
      ],
    });
    if (!enterprise) {
      return res.status(404).json({ message: "Pas de Enterprise trouvée" });
    }
    const enterpriseData = enterprise.toJSON();
    enterpriseData.remainingAvailability = remainingAvailability;
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
      User_id,
      Job_id,
    } = req.body;
    const photos = req.files ? req.files.map((file) => file.path) : [];
    const job = await Job.findByPk(Job_id);
    if (!job) {
      return res.status(404).json({ message: "Pas de job trouvé" });
    }
    const user = await User.findByPk(User_id);
    if (!user) {
      return res.status(404).json({ message: "Pas d'utilisateur trouvé" });
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
      User_id,
      Job_id,
    });
    res.status(201).json(newEnterprise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEnterprise = async (req, res) => {
  try {
    const { id } = req.params;
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
      Job_id,
      removePhotos = [],
    } = req.body;

    // Trouver l'entreprise
    const enterprise = await Enterprise.findByPk(id);
    if (!enterprise) {
      return res.status(404).json({ message: "Entreprise non trouv�e" });
    }

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
    if (Job_id) {
      // Si Job_id est fourni, vous pouvez ajouter une validation ici
      enterprise.Job_id = Job_id;
    }

    // Gestion des nouvelles photos
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => file.path);
      enterprise.photos = [...enterprise.photos, ...newPhotos];
    }

    // Suppression des photos
    if (removePhotos.length > 0) {
      removePhotos.forEach((photo) => {
        const index = enterprise.photos.indexOf(photo);
        if (index > -1) {
          enterprise.photos.splice(index, 1);
          deleteFile(photo);
        }
      });
    }

    await enterprise.save();
    res.status(200).json(enterprise);
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
