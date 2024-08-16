const { sequelize } = require("../../../models/index");
const User = sequelize.models.User;
const files = require("../../utils/files");

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
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "User_id",
              "Job_id",
              "Country_id",
            ],
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
            exclude: [
              "createdAt",
              "updatedAt",
              "User_id",
              "Job_id",
              "Country_id",
            ],
          },
        },
        {
          model: sequelize.models.Reservation,
          as: "reservations",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: sequelize.models.Offer,
            as: "offer",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
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
          },
        },
        {
          model: sequelize.models.Like,
          as: "likes",
          attributes: {
            exclude: ["createdAt", "updatedAt", "User_id", "Enterprise_id"],
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
                "isValidate",
                "facebook",
                "instagram",
                "twitter",
                "siret_number",
                "description",
                "website",
                "photos",
                "adress",
              ],
            },
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

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
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
            exclude: [
              "createdAt",
              "updatedAt",
              "User_id",
              "Job_id",
              "Country_id",
            ],
          },
        },
        {
          model: sequelize.models.Reservation,
          as: "reservations",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: sequelize.models.Offer,
            as: "offer",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
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
          },
        },
        {
          model: sequelize.models.Like,
          as: "likes",
          attributes: {
            exclude: ["createdAt", "updatedAt", "User_id", "Enterprise_id"],
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
                "isValidate",
                "facebook",
                "instagram",
                "twitter",
                "siret_number",
                "description",
                "website",
                "photos",
                "adress",
              ],
            },
          },
        },
      ],
    });

    if (user.avatar) {
      const avatarUrl = files.getUrl(req, "avatars", user.avatar);
      user.dataValues.avatar = avatarUrl;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
