const jwt = require("jsonwebtoken");
const { sequelize } = require("../../models/index");
const User = sequelize.models.User;

const isAuthenticated = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Utilisateur non connecté" });
  }
  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.User_id);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token Invalide" });
  }
};

const isAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Action non autorisée" });
  }
  next();
};

const isOwner = (model) => async (req, res, next) => {
  const { id } = req.params;
  try {
    if (model === "User") {
      return next();
    }
    let resourceId;
    const resource = await sequelize.models[model].findByPk(id);
    if (!resource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }
    if (resourceId !== req.user.id && req.user.isAdmin !== true) {
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
    }
    req.resource = resource;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const isEnterpriseOwner = () => async (req, res, next) => {
  const { id } = req.params;
  if (!req.user) {
    return res.status(401).json({ message: "Utilisateur non connecté" });
  }

  try {
    const enterprise = await sequelize.models.Enterprise.findByPk(id);
    if (!enterprise) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }

    if (
      enterprise.User_id !== req.user.id &&
      req.user.isAdmin !== true &&
      enterprise.isValidate !== true
    ) {
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
    }
    req.enterprise = enterprise;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const isAuthorizedReservation = async (req, res, next) => {
  try {
    const reservationId = req.params.id;

    if (reservationId) {
      const reservation = await sequelize.models.Reservation.findByPk(
        reservationId,
        {
          include: [
            {
              model: sequelize.models.Offer,
              as: "offer",
              include: [
                {
                  model: sequelize.models.Enterprise,
                  as: "enterprise",
                },
              ],
            },
          ],
        },
      );
      if (!reservation) {
        return res.status(404).json({ message: "Reservation non trouvée" });
      }
      if (
        reservation.User_id === req.user.id ||
        reservation.offer.enterprise.User_id === req.user.id ||
        req.user.isAdmin === true
      ) {
        return next();
      } else {
        return res.status(403).json({
          message: "Vous n'êtes pas autorisé à effectuer cette action",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  isAuthenticated,
  isOwner,
  isEnterpriseOwner,
  isAdmin,
  isAuthorizedReservation,
};
