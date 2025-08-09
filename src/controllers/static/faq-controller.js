const { sequelize } = require("../../../models/index");
const Faq = sequelize.models.Faq;

exports.getAllFaqs = async (req, res) => {
  try {
    const faq = await Faq.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    if (!faq) {
      return res.status(404).json({ errors: "Pas de faq trouvée" });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const { questions, response } = req.body;
    const newFaq = await Faq.create({ questions, response });
    res.status(201).json({ message: "FAQ créée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { questions, response } = req.body;
    const faq = await Faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({ errors: "Pas de faq trouvée" });
    }
    faq.questions = questions || faq.questions;
    faq.response = response || faq.response;
    await faq.save();
    res.status(200).json({ message: "FAQ modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({ errors: "Pas de faq trouvée" });
    }
    await faq.destroy();
    res.status(200).json({ message: "faq supprimée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
