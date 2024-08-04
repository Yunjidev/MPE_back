const { sequelize } = require("../../models/index");
const Offer = sequelize.models.Offer;
const { deleteFile } = require("../middlewares/files-middleware");

exports.getAllOffers = async (req, res) => {
  try {
    const offer = await Offer.findAll();
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id);
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
    const { id } = req.params;
    const { name, description, price, estimate } = req.body;
    const image = req.file ? req.file.path : null;
    const enterprise = await sequelize.models.Enterprise.findByPk(id);
    if (!enterprise) {
      return res.status(404).json({ message: "Pas d'entreprise trouvée" });
    }
    const newOffer = await Offer.create({
      name,
      description,
      price,
      estimate,
      image,
      Enterprise_id: id,
    });
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, estimate, removeImage } = req.body;
    const image = req.file ? req.file.path : null;
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: "Pas de offre trouvée" });
    }
    offer.name = name || offer.name;
    offer.description = description || offer.description;
    offer.price = price || offer.price;
    offer.estimate = estimate || offer.estimate;
    if (image) {
      if (offer.image) {
        deleteFile(offer.image);
      }
      offer.image = image;
    } else if (removeImage === "true" && offer.image) {
      deleteFile(offer.image);
      offer.picture = null;
    }
    await offer.save();
    res.status(200).json(offer);
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