const { sequelize } = require("../../../models/index");
const Pricing = sequelize.models.Pricings;

exports.getAllPricings = async (req, res) => {
  try {
    const pricings = await Pricing.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    res.status(200).json(pricings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPricingById = async (req, res) => {
  try {
    const { id } = req.params;
    const pricing = await Pricing.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    if (!pricing) {
      return res.status(404).json({ message: "Pas de tarification trouvée" });
    }
    res.status(200).json(pricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPricing = async (req, res) => {
  try {
    const { offre, price, description } = req.body;
    const newPricing = await Pricing.create({ offre, price, description });
    res.status(201).json({ message: "Tarification créée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { offre, price, description } = req.body;
    const pricing = await Pricing.findByPk(id);
    if (!pricing) {
      return res.status(404).json({ message: "Pas de tarification trouvée" });
    }
    pricing.offre = offre || pricing.offre;
    pricing.price = price || pricing.price;
    pricing.description = description || pricing.description;
    await pricing.save();
    res.status(200).json({ message: "Tarification modifiée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const pricing = await Pricing.findByPk(id);
    if (!pricing) {
      return res.status(404).json({ message: "Pas de tarification trouvée" });
    }
    await pricing.destroy();
    res.status(200).json({ message: "Tarification supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
