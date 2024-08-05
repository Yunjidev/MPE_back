const jwt = require("jsonwebtoken");

const generateToken = (User_id, expiresIn = "1h") => {
  return jwt.sign({ User_id }, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
