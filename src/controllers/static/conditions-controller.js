const { sequelize } = require("../../../models/index");
const Condition = sequelize.models.Conditions;

exports.getAllConditions = async (req, res) => {
  try {
    const condition = await Condition.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    res.status(200).json(condition);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getConditionById = async (req, res) => {
  try {
    const { id } = req.params;
    const condition = await Condition.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    if (!condition) {
      return res.status(404).json({ errors: "Pas de Condition trouvée" });
    }
    res.status(200).json(condition);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.createCondition = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCondition = await Condition.create({ title, description });
    res.status(201).json({ message: "Condition créée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.updateCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const condition = await Condition.findByPk(id);
    if (!condition) {
      return res.status(404).json({ errors: "Pas de conditions trouvée" });
    }
    condition.title = title || condition.title;
    condition.description = description || condition.description;
    await condition.save();
    res.status(200).json({ message: "Condition modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deleteCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const condition = await Condition.findByPk(id);
    if (!condition) {
      return res.status(404).json({ errors: "Pas de conditions trouvée" });
    }
    await condition.destroy();
    res.status(200).json({ message: "conditions supprimée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
