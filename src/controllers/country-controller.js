const { sequelize } = require("../../models/index");
const Country = sequelize.models.Country;

exports.getAllCountries = async (req, res) => {
  try {
    const country = await Country.findAll();
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByPk(id);
    if (!country) {
      return res.status(404).json({ message: "Pas de region trouvée" });
    }
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCountry = async (req, res) => {
  try {
    const newCountry = await Country.create(req.body);
    res.status(201).json(newCountry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const country = await Country.findByPk(id);
    if (!country) {
      return res.status(404).json({ message: "Pas de region trouvée" });
    }
    country.name = name || country.name;
    await country.save();
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByPk(id);
    if (!country) {
      return res.status(404).json({ message: "Pas de region trouvée" });
    }
    await country.destroy();
    res.status(200).json({ message: "Region supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
