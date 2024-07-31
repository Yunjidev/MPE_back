const { sequelize } = require("../../models/index");
const Disponibility = sequelize.models.Disponibility;
const Enterprise = sequelize.models.Enterprise;

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
    const { day, start_hour, end_hour, Enterprise_id } = req.body;
    const enterprise = await Enterprise.findByPk(Enterprise_id);
    if (!enterprise) {
      return res.status(404).json({ message: "Pas d'entreprise trouvée" });
    }
    if (!Array.isArray(day)) {
      return res.status(400).json({ message: "Le jour doit être un tableau" });
    }
    const newDisponibilities = await Promise.all(
      day.map(async (day) => {
        return await Disponibility.create({
          day,
          start_hour,
          end_hour,
          Enterprise_id,
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
