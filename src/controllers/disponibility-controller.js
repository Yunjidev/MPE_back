const { sequelize } = require("../../models/index");
const Disponibility = sequelize.models.Disponibility;

exports.getAllDisponibilities = async (req, res) => {
  try {
    const disponibility = await Disponibility.findAll();
    res.status(200).json(disponibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDisponibilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const disponibility = await Disponibility.findByPk(id);
    if (!disponibility) {
      return res.status(404).json({ message: "Pas de disponibility trouvée" });
    }
    res.status(200).json(disponibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDisponibility = async (req, res) => {
  try {
    const { day, start_hour, end_hour } = req.body;
    if (!Array.isArray(day)) {
      return res.status(400).json({ message: "Le jour doit être un tableau" });
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
      return res.status(400).json({ message: "Disponibilité déjà existante" });
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
    res.status(201).json(newDisponibilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDisponibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, start_hour, end_hour } = req.body;
    const disponibility = await Disponibility.findByPk(id);
    if (!disponibility) {
      return res.status(404).json({ message: "Pas de disponibility trouvée" });
    }
    const overlapping = await Disponibility.isOverlapping(
      day || disponibility.day,
      start_hour || disponibility.start_hour,
      end_hour || disponibility.end_hour,
      req.enterprise.id,
      id,
    );
    if (overlapping) {
      return res.status(400).json({ message: "Disponibilité déjà existante" });
    }

    disponibility.day = day || disponibility.day;
    disponibility.start_hour = start_hour || disponibility.start_hour;
    disponibility.end_hour = end_hour || disponibility.end_hour;
    await disponibility.save();
    res.status(200).json(disponibility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDisponibility = async (req, res) => {
  try {
    const { id } = req.params;
    const disponibility = await Disponibility.findByPk(id);
    if (!disponibility) {
      return res.status(404).json({ message: "Pas de disponibility trouvée" });
    }
    await disponibility.destroy();
    res.status(200).json({ message: "disponibility supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
