const jwt = require("jsonwebtoken");

const generateAccessToken = (User_id, expiresIn = "15m") => {
  return jwt.sign({ User_id }, process.env.JWT_SECRET, { expiresIn });
};

const generateRefreshToken = (User_id, expiresIn = "7d") => {
  return jwt.sign({ User_id }, process.env.JWT_REFRESH_SECRET, { expiresIn });
};

module.exports = { generateAccessToken, generateRefreshToken };
