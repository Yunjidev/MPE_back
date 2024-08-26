const { sequelize } = require("../../../models/index");
const files = require("../../utils/files");

// Fonction pour mettre à jour un utilisateur
exports.moderateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await sequelize.models.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ errors: "Pas d'utilisateur trouvé" });
    }

    const {
      username,
      firstname,
      lastname,
      email,
      password,
      isAdmin,
      avatar,
      removeAvatar,
    } = req.body;

    user.username = username || user.username;
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.isAdmin = isAdmin || user.isAdmin;

    if (avatar) {
      if (user.avatar) {
        files.deleteFile(user.avatar);
      }
      user.avatar = avatar;
    } else if (removeAvatar === "true" && user.avatar) {
      files.deleteFile(user.avatar);
      user.avatar = null;
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    };

    await user.save();
    res
      .status(200)
      .json({ user: userData, message: "Utilisateur mis à jour !" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

// Fonction pour supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await sequelize.models.User.findByPk(id);
    if (user.avatar) {
      files.deleteFile(user.avatar);
    }

    await user.destroy();
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
