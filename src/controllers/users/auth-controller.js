const { sequelize } = require('../../../models/index');
const User = sequelize.models.User;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../../config/jwt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const sendEmail = require('../../mailers/email-service');
const files = require('../../utils/files');

// Fonction pour enrigistrer un nouvel utilisateur
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const avatar = req.file ? req.file.path : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: "Le nom d'utilisateur existe déjà" });
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ errors: "L'email existe déjà" });
    }
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    sendEmail(email, 'Bienvenue à ma Petite Entreprise', 'welcome', {
      user: username,
      url: `${process.env.CLIENT_URL}`,
    });
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      avatar: user.avatar,
    };
    if (user.avatar) {
      const avatarUrl = files.getUrl(req, 'users/avatar', user.avatar);
      userData.avatar = avatarUrl;
    }
    res.setHeader('Authorization', `${accessToken}`);
    res.status(201).json({
      user: userData,
      refreshToken,
      message: 'Utilisateur créé et connecté !',
    });
  } catch (error) {
    console.error('❌ ERREUR DANS /signup :', error);
    res.status(500).json({ errors: error.message });
  }
};

// Fonction pour se connecter
exports.login = async (req, res) => {
  try {
    console.log('📩 /signin hit !');
    console.log('📬 req.body reçu :', req.body);

    const { identifier, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });
    if (!user) {
      return res.status(404).json({ errors: "Pas d'utilisateur trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ errors: 'Mot de passe non valide' });
    }

    const enterprises = await user.getEnterprises();
    const enterprisesData = enterprises.map((enterprise) => {
      const filteredEnterprise = {
        id: enterprise.id,
        name: enterprise.name,
        isValidate: enterprise.isValidate,
      };
      if (enterprise.logo) {
        const logoUrl = files.getUrl(req, 'enterprises/logo', enterprise.logo);
        filteredEnterprise.logo = logoUrl;
      }
      return filteredEnterprise;
    });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      isAdmin: user.isAdmin,
      isEntrepreneur: user.isEntrepreneur,
      avatar: user.avatar,
    };
    if (user.avatar) {
      const avatarUrl = files.getUrl(req, 'users/avatar', user.avatar);
      userData.avatar = avatarUrl;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.setHeader('Authorization', `${accessToken}`);
    res.status(200).json({
      user: userData,
      enterprises: enterprisesData,
      refreshToken,
      accessToken,
      message: 'Utilisateur connecté !',
    });
  } catch (error) {
    console.error('❌ ERREUR DANS /signin :', error);
    res.status(500).json({ errors: error.message });
  }
};

// Fonction pour la deconnexion
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: 'Utilisateur déconnecté !' });
  } catch (err) {
    res.status(500).json({ errors: err.errors });
  }
};

// Fonction pour mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const user = req.user;
    const {
      username,
      firstname,
      lastname,
      email,
      password,
      isAdmin,
      removeAvatar,
    } = req.body;
    const avatar = req.file ? req.file.path : null;

    user.username = username || user.username;
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    // Si l'utilisateur est admin, in ne peut pas changer son email
    if (!req.user.isAdmin) {
      user.email = email || user.email;
    }

    // Seul un admin peut changer le statut isAdmin
    if (req.user.isAdmin) {
      user.isAdmin = isAdmin || user.isAdmin;
    }

    // Si le mot de passe est fourni, on le hash
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (avatar) {
      if (user.avatar) {
        files.deleteFile(user.avatar);
      }
      user.avatar = avatar;
    } else if (removeAvatar === 'true' && user.avatar) {
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
    if (user.avatar) {
      const avatarUrl = files.getUrl(req, 'users/avatar', user.avatar);
      userData.avatar = avatarUrl;
    }
    res
      .status(200)
      .json({ user: userData, message: 'Utilisateur mis à jour !' });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

// Fonction pour supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.avatar) {
      files.deleteFile(req.user.avatar);
    }

    await req.user.destroy();
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

// Fonction pour initier la réinitialisation du mot de passe
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ errors: "Pas d'utilisateur trouvé" });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    sendEmail(email, 'Re-initialiser votre mot de passe', 'resetpassword', {
      user: user.username,
      url: `${process.env.REACT_URL}/${resetToken}`,
    });
    res.status(200).json({ message: 'Email de re-initialisation envoyé' });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

// Fonction pour réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(404).json({ errors: "Pas d'utilisateur trouvé" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Mot de passe modifié' });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

// Fonction pour Refresh le token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token non renseigné' });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.User_id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const accessToken = generateAccessToken(user.id);
    res.setHeader('Authorization', `${accessToken}`);
    res.status(200).json({ message: 'Token refresh' });
  } catch (error) {
    return res.status(401).json({ message: 'Token Invalide' });
  }
};

exports.validateRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh Token non renseigné' });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.User_id);
    const accessToken = generateAccessToken(user.id);
    res.setHeader('Authorization', `${accessToken}`);
    res.status(200).json({ refreshToken, message: 'Token refresh' });
  } catch (error) {
    return res.status(401).json({ errors: 'Token Invalide' });
  }
};
