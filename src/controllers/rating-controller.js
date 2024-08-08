const { sequelize } = require("../../models/index");
const Rating = sequelize.models.Rating;

exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "Offer_id", "id", "User_id"],
      },
      include: [
        {
          model: sequelize.models.Offer,
          as: "offer",
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
        },
        {
          model: sequelize.models.User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "firstname",
              "lastname",
              "email",
              "isAdmin",
              "isEntrepeneur",
              "password",
              "resetPasswordToken",
              "resetPasswordExpires",
            ],
          },
        },
      ],
    });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "Offer_id", "id", "User_id"],
      },
      include: [
        {
          model: sequelize.models.Offer,
          as: "offer",
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
        },
        {
          model: sequelize.models.User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "firstname",
              "lastname",
              "email",
              "isAdmin",
              "isEntrepeneur",
              "password",
              "resetPasswordToken",
              "resetPasswordExpires",
            ],
          },
        },
      ],
    });
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
    const { id } = req.params;
    const { note, comment } = req.body;
    const offer = await sequelize.models.Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: "Pas d'offre trouvée" });
    }
    if (!req.user) {
      return res.status(404).json({ message: "Pas d'utilisateur trouvé" });
    }
    const newRating = await Rating.create({
      note,
      comment,
      Offer_id: offer.id,
      User_id: req.user.id,
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
