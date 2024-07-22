const jwt = require("jsonwebtoken");

const generateToken = (userId, expiresIn = "1h") => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
