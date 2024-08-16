const { sequelize } = require("../../../models/index");
const Offer = sequelize.models.Offer;
const files = require("../../utils/files");
const { calculateAverageRatingForOffer } = require("../../utils/ratings");

exports.getAllOffers = async (req, res) => {
  try {
    const offer = await Offer.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "Enterprise_id"],
      },
    });
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id, {
      include: [
        {
          model: sequelize.models.Enterprise,
          as: "enterprise",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "isValidate",
              "User_id",
              "Job_id",
              "Country_id",
              "photos",
              "facebook",
              "instagram",
              "twitter",
              "siret_number",
              "description",
              "phone",
              "mail",
              "adress",
              "city",
              "zip_code",
            ],
          },
        },
        {
          model: sequelize.models.Rating,
          as: "ratings",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "Enterprise_id", "id"],
      },
    });
    if (!offer) {
      return res.status(404).json({ message: "Pas de offre trouvée" });
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const enterpriseId = req.enterprise.id;
    const { name, description, estimate, duration } = req.body;
    const estimateBoolean = req.body.estimate === "true";
    const price = estimateBoolean ? null : parseFloat(req.body.price);
    const image = req.file ? req.file.path : null;
    const newOffer = await Offer.create({
      name,
      description,
      price,
      estimateBoolean,
      image,
      duration,
      Enterprise_id: enterpriseId,
    });
    res.status(201).json({ message: "Offre créée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, estimate, duration, removeImage } =
      req.body;
    const image = req.file ? req.file.path : null;
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: "Pas de offre trouvée" });
    }
    offer.name = name || offer.name;
    offer.description = description || offer.description;
    offer.price = price || offer.price;
    offer.estimate = estimate || offer.estimate;
    offer.duration = duration || offer.duration;
    if (image) {
      if (offer.image) {
        files.deleteFile(offer.image);
      }
      offer.image = image;
    } else if (removeImage === "true" && offer.image) {
      files.deleteFile(offer.image);
      offer.picture = null;
    }
    await offer.save();
    res.status(200).json({ message: "Offre modifiée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: "Pas de offre trouvée" });
    }
    await offer.destroy();
    res.status(200).json({ message: "offre supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
