const { sequelize } = require("../../models");

exports.getAllLikes = async (req, res) => {
  try {
    const likes = await sequelize.models.Like.findAll();
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const User_id = req.user.id;
    const likes = await sequelize.models.Like.findAll({
      where: {
        User_id,
      },
    });
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLikeByEnterpriseId = async (req, res) => {
  try {
    const Enterprise_id = req.params.id;
    const like = await sequelize.models.Like.findOne({
      where: {
        Enterprise_id,
      },
    });
    if (!like) {
      return res.status(404).json({ errors: "Pas de like trouvé" });
    }
    res.status(200).json(like);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.createLike = async (req, res) => {
  try {
    const User_id = req.user.id;
    const Enterprise_id = req.params.id;

    const existingLike = await sequelize.models.Like.findOne({
      where: {
        User_id,
        Enterprise_id,
      },
    });

    if (existingLike) {
      return res.status(400).json({
        errors: "Vous avez déjà aimé cette entreprise",
      });
    }

    const newLike = await sequelize.models.Like.create({
      User_id,
      Enterprise_id,
    });

    return res.status(201).json({ message: "Vous avez aimé cette entreprise" });
  } catch (error) {
    return res.status(500).json({ errors: error.errors });
  }
};

exports.deleteLike = async (req, res) => {
  try {
    const User_id = req.user.id;
    const Enterprise_id = req.params.id;

    const existingLike = await sequelize.models.Like.findOne({
      where: {
        User_id,
        Enterprise_id,
      },
    });

    if (!existingLike) {
      return res.status(400).json({
        errors: "Vous n'avez pas aimé cette entreprise",
      });
    }

    await existingLike.destroy();

    return res
      .status(200)
      .json({ message: "Vous n'avez plus aimé cette entreprise" });
  } catch (error) {
    return res.status(500).json({ errors: error.errors });
  }
};
