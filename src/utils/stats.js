const { sequelize } = require("../../models/index");

async function getUserLength() {
  const users = await sequelize.models.User.findAll({
    attributes: ["id"],
  });
  return users.length;
}

async function getEntrepreneurLength() {
  const entrepreneurs = await sequelize.models.User.findAll({
    where: {
      isEntrepreneur: true,
    },
    attributes: ["id"],
  });
  return entrepreneurs.length;
}

async function getEnterpriseLength() {
  const enterprises = await sequelize.models.Enterprise.findAll({
    attributes: ["id"],
  });
  return enterprises.length;
}

async function getReservationLength() {
  const reservations = await sequelize.models.Reservation.findAll({
    attributes: ["id"],
  });
  return reservations.length;
}

async function getPremiumEnterpriseLength() {
  const premiumEnterprises = await sequelize.models.Subscription.findAll({
    where: {
      status: "active",
    },
    attributes: ["id"],
  });
  return premiumEnterprises.length;
}

module.exports = {
  getUserLength,
  getEntrepreneurLength,
  getEnterpriseLength,
  getReservationLength,
  getPremiumEnterpriseLength,
};
