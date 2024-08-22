const stats = require("../utils/stats");

exports.getAllStats = async (req, res) => {
  try {
    const [
      userLength,
      entrepreneurLength,
      enterpriseLength,
      reservationLength,
      premiumEnterpriseLength,
    ] = await Promise.all([
      stats.getUserLength(),
      stats.getEntrepreneurLength(),
      stats.getEnterpriseLength(),
      stats.getReservationLength(),
      stats.getPremiumEnterpriseLength(),
    ]);
    res.status(200).json({
      userLength,
      entrepreneurLength,
      enterpriseLength,
      reservationLength,
      premiumEnterpriseLength,
    });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
