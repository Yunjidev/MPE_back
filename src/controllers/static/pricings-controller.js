const { sequelize } = require("../../../models/index");
const Pricing = sequelize.models.Pricings;

exports.getAllPricings = async (req, res) => {
  try {
    const pricings = await Pricing.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).json(pricings);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getPricingById = async (req, res) => {
  try {
    const { id } = req.params;
    const pricing = await Pricing.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!pricing) {
      return res.status(404).json({ errors: "Pas de tarification trouvée" });
    }
    res.status(200).json(pricing);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.createPricing = async (req, res) => {
  try {
    const { offre, price, description, isMostPopular, features } = req.body;
    const newPricing = await Pricing.create({
      offre,
      price,
      description,
      isMostPopular,
      features,
    });
    res.status(201).json({ message: "Tarification créée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { offre, price, description, isMostPopular, features } = req.body;
    const pricing = await Pricing.findByPk(id);
    if (!pricing) {
      return res.status(404).json({ errors: "Pas de tarification trouvée" });
    }
    pricing.offre = offre || pricing.offre;
    pricing.price = price || pricing.price;
    pricing.description = description || pricing.description;
    pricing.isMostPopular = isMostPopular || pricing.isMostPopular;
    pricing.features = features || pricing.features;
    await pricing.save();
    res.status(200).json({ message: "Tarification modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deletePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const pricing = await Pricing.findByPk(id);
    if (!pricing) {
      return res.status(404).json({ errors: "Pas de tarification trouvée" });
    }
    await pricing.destroy();
    res.status(200).json({ message: "Tarification supprimée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
