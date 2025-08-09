const { sequelize } = require("../../../models/index");
const Country = sequelize.models.Country;

exports.getAllCountries = async (req, res) => {
  try {
    const country = await Country.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    country.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    if (!country) {
      return res.status(404).json({ errors: "Pas de region trouvée" });
    }
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.createCountry = async (req, res) => {
  try {
    const newCountry = await Country.create(req.body);
    res.status(201).json({ message: "Country créée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const country = await Country.findByPk(id);
    if (!country) {
      return res.status(404).json({ errors: "Pas de region trouvée" });
    }
    country.name = name || country.name;
    await country.save();
    res.status(200).json({ message: "Region modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByPk(id);
    if (!country) {
      return res.status(404).json({ errors: "Pas de region trouvée" });
    }
    await country.destroy();
    res.status(200).json({ message: "Region supprimée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
