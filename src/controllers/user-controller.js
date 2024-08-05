const { sequelize } = require("../../models/index");
const User = sequelize.models.User;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: [
          "password",
          "resetPasswordToken",
          "resetPasswordExpires",
          "createdAt",
          "updatedAt",
        ],
      },
      include: [
        {
          model: sequelize.models.Enterprise,
          as: "enterprises",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
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
        exclude: [
          "password",
          "resetPasswordToken",
          "resetPasswordExpires",
          "createdAt",
          "updatedAt",
        ],
      },
      include: [
        {
          model: sequelize.models.Enterprise,
          as: "enterprises",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: sequelize.models.Reservation,
          as: "reservations",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: sequelize.models.Rating,
          as: "ratings",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "Pas d'utilisateur trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
