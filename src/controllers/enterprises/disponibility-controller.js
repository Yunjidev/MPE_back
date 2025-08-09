const { sequelize } = require("../../../models/index");
const Disponibility = sequelize.models.Disponibility;

exports.getAllDisponibilities = async (req, res) => {
  try {
    const disponibility = await Disponibility.findAll({
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
    res.status(200).json(disponibility);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getDisponibilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const disponibility = await Disponibility.findByPk(id, {
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
    if (!disponibility) {
      return res.status(404).json({ errors: "Pas de disponibility trouvée" });
    }
    res.status(200).json(disponibility);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.createDisponibility = async (req, res) => {
  try {
    const { day, start_hour, end_hour } = req.body;
    if (!req.enterprise.isValidate) {
      return res.status(400).json({ errors: "L'entreprise n'est pas validée" });
    }
    const overlapping = await Promise.all(
      day.map(async (day) => {
        return await Disponibility.isOverlapping(
          day,
          start_hour,
          end_hour,
          req.enterprise.id,
        );
      }),
    );
    if (overlapping.some((overlap) => overlap)) {
      return res.status(400).json({ errors: "Disponibilité déjà existante" });
    }
    const newDisponibilities = await Promise.all(
      day.map(async (day) => {
        return await Disponibility.create({
          day,
          start_hour,
          end_hour,
          Enterprise_id: req.enterprise.id,
        });
      }),
    );
    res.status(201).json({ message: "Disponibilité créée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.updateDisponibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, start_hour, end_hour } = req.body;
    const disponibility = await Disponibility.findByPk(id);
    if (!disponibility) {
      return res.status(404).json({ errors: "Pas de disponibilité trouvée" });
    }
    const overlapping = await Disponibility.isOverlapping(
      day || disponibility.day,
      start_hour || disponibility.start_hour,
      end_hour || disponibility.end_hour,
      req.enterprise.id,
      id,
    );
    if (overlapping) {
      return res.status(400).json({ errors: "Disponibilité déjà existante" });
    }

    disponibility.day = day || disponibility.day;
    disponibility.start_hour = start_hour || disponibility.start_hour;
    disponibility.end_hour = end_hour || disponibility.end_hour;
    await disponibility.save();
    res.status(200).json({ message: "Disponibilité modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deleteDisponibility = async (req, res) => {
  try {
    const { id } = req.params;
    const disponibility = await Disponibility.findByPk(id);
    if (!disponibility) {
      return res.status(404).json({ errors: "Pas de disponibilité trouvée" });
    }
    await disponibility.destroy();
    res.status(200).json({ message: "disponibilité supprimée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
