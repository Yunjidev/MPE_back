const { sequelize } = require("../../../models/index");
const Indisponibility = sequelize.models.Indisponibility;

exports.getAllInDisponibilities = async (req, res) => {
  try {
    const indisponibilities = await Indisponibility.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "Enterprise_id", "id"],
      },
      include: {
        model: sequelize.models.Enterprise,
        as: "enterprise",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "id",
            "User_id",
            "Job_id",
            "Country_id",
            "phone",
            "mail",
            "adress",
            "city",
            "zip_code",
            "isValidate",
            "facebook",
            "instagram",
            "twitter",
            "siret_number",
            "description",
            "website",
            "photos",
          ],
        },
      },
    });
    res.status(200).json(indisponibilities);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getInDisponibilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const indisponibility = await Indisponibility.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "Enterprise_id", "id"],
      },
      include: {
        model: sequelize.models.Enterprise,
        as: "enterprise",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "id",
            "User_id",
            "Job_id",
            "Country_id",
            "phone",
            "mail",
            "adress",
            "city",
            "zip_code",
            "isValidate",
            "facebook",
            "instagram",
            "twitter",
            "siret_number",
            "description",
            "website",
            "photos",
          ],
        },
      },
    });
    if (!indisponibility) {
      return res.status(404).json({ errors: "Pas de indisponibility trouvée" });
    }
    res.status(200).json(indisponibility);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.createInDisponibility = async (req, res) => {
  try {
    const { start_date, start_hour, end_date, end_hour } = req.body;
    if (!req.enterprise.isValidate) {
      return res(400).json({ errors: "L'entreprise n'est pas validée" });
    }
    const newIndisponibility = await Indisponibility.create({
      start_date,
      start_hour,
      end_date,
      end_hour,
      Enterprise_id: req.enterprise.id,
    });
    res.status(201).json({ message: "Indisponibilité créée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.updateInDisponibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, start_hour, end_date, end_hour } = req.body;
    const indisponibility = await Indisponibility.findByPk(id);
    if (!indisponibility) {
      return res.status(404).json({ errors: "Pas de indisponibility trouvée" });
    }
    indisponibility.start_date = start_date || indisponibility.start_date;
    indisponibility.start_hour = start_hour || indisponibility.start_hour;
    indisponibility.end_date = end_date || indisponibility.end_date;
    indisponibility.end_hour = end_hour || indisponibility.end_hour;
    await indisponibility.save();
    res.status(200).json({ message: "Indisponibilité modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deleteInDisponibility = async (req, res) => {
  try {
    const { id } = req.params;
    const indisponibility = await Indisponibility.findByPk(id);
    if (!indisponibility) {
      return res
        .status(404)
        .json({ message: "Pas de indisponibility trouvée" });
    }
    await indisponibility.destroy();
    res.status(200).json({ message: "indisponibility supprimée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
