const { sequelize } = require("../../models/index");
const Rating = sequelize.models.Rating;

exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll();
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findByPk(id);
    if (!rating) {
      return res.status(404).json({ message: "Pas de rating trouvée" });
    }
    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRating = async (req, res) => {
  try {
    const { note, comment, Enterprise_id, User_id } = req.body;
    const enterprise =
      await sequelize.models.Enterprise.findByPk(Enterprise_id);
    if (!enterprise) {
      return res.status(404).json({ message: "Pas d'entreprise trouvée" });
    }
    const user = await sequelize.models.User.findByPk(User_id);
    if (!user) {
      return res.status(404).json({ message: "Pas d'utilisateur trouvé" });
    }
    const newRating = await Rating.create({
      note,
      comment,
      Enterprise_id,
      User_id,
    });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findByPk(id);
    if (!rating) {
      return res.status(404).json({ message: "Pas de rating trouvée" });
    }
    await rating.destroy();
    res.status(200).json({ message: "rating supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
