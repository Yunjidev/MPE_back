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
          // "createdAt",
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
              "photos",
            ],
          },
        },
      ],
    });
    const usersData = users.map((user) => {
      if (user.avatar) {
        const avatarUrl = files.getUrl(req, "users/avatar", user.avatar);
        user.dataValues.avatar = avatarUrl;
      }
      user.enterprises = user.enterprises.map((enterprise) => {
        if (enterprise.logo) {
          const logoUrl = files.getUrl(
            req,
            "enterprises/logo",
            enterprise.logo,
          );
          enterprise.dataValues.logo = logoUrl;
        }
        return enterprise.dataValues;
      });
      return user.dataValues;
    });
    res.status(200).json(usersData);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
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
      return res.status(404).json({ errors: "Pas d'utilisateur trouvé" });
    }
    if (user.avatar) {
      const avatarUrl = files.getUrl(req, "users/avatar", user.avatar);
      user.dataValues.avatar = avatarUrl;
    }
    user.enterprises = user.enterprises.map((enterprise) => {
      if (enterprise.logo) {
        const logoUrl = files.getUrl(req, "enterprises/logo", enterprise.logo);
        enterprise.dataValues.logo = logoUrl;
      }
      return enterprise.dataValues;
    });

    user.reservations.map((reservation) => {
      if (reservation.offer.enterprise.logo) {
        const logoUrl = files.getUrl(
          req,
          "enterprises/logo",
          reservation.offer.enterprise.logo,
        );
        reservation.offer.enterprise.dataValues.logo = logoUrl;
      }
      return reservation.dataValues;
    });

    user.likes.map((like) => {
      if (like.enterprise.logo) {
        const logoUrl = files.getUrl(
          req,
          "enterprises/logo",
          like.enterprise.logo,
        );
        like.enterprise.dataValues.logo = logoUrl;
      }
      return like.dataValues;
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
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
        {
          model: sequelize.models.Rating,
          as: "ratings",
          attributes: {
            exclude: ["createdAt", "updatedAt", "User_id", "Enterprise_id"],
          },
        },
      ],
    });
    if (user.avatar) {
      const avatarUrl = files.getUrl(req, "users/avatar", user.avatar);
      user.dataValues.avatar = avatarUrl;
    }
    user.enterprises = user.enterprises.map((enterprise) => {
      if (enterprise.logo) {
        const logoUrl = files.getUrl(req, "enterprises/logo", enterprise.logo);
        enterprise.dataValues.logo = logoUrl;
      }
      return enterprise.dataValues;
    });

    user.reservations.map((reservation) => {
      if (reservation.offer.enterprise.logo) {
        const logoUrl = files.getUrl(
          req,
          "enterprises/logo",
          reservation.offer.enterprise.logo,
        );
        reservation.offer.enterprise.dataValues.logo = logoUrl;
      }
      return reservation.dataValues;
    });

    user.likes.map((like) => {
      if (like.enterprise.logo) {
        const logoUrl = files.getUrl(
          req,
          "enterprises/logo",
          like.enterprise.logo,
        );
        like.enterprise.dataValues.logo = logoUrl;
      }
      return like.dataValues;
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
