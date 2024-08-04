const { sequelize } = require("../../models/index");
const User = sequelize.models.User;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        include: ["enterprises"],
        exclude: [
          "password",
          "resetPasswordToken",
          "resetPasswordExpires",
          "createdAt",
          "updatedAt",
        ],
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: {
        include: ["enterprises", "reservations", "ratings"],
        exclude: [
          "password",
          "resetPasswordToken",
          "resetPasswordExpires",
          "createdAt",
          "updatedAt",
        ],
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Pas d'utilisateur trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
