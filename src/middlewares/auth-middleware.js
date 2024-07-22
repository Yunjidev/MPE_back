const jwt = require("jsonwebtoken");
const { sequelize } = require("../../models/index");
const User = sequelize.models.User;
const { verifyToken } = require("../../config/jwt");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[2];

    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(403).json({ error: "Action non autorisé" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = authMiddleware;
