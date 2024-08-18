const { sequelize } = require("../../models/index");

async function calculateAverageRatingForOffer(offerId) {
  const ratings = await sequelize.models.Rating.findAll({
    where: {
      Offer_id: offerId,
    },
  });
  if (ratings.length === 0) {
    return 0;
  }
  const totalRating = ratings.reduce((acc, rating) => acc + rating.note, 0);
  return totalRating / ratings.length;
}

async function calculateAverageRatingForEnterprise(enterpriseId) {
  const offers = await sequelize.models.Offer.findAll({
    where: {
      Enterprise_id: enterpriseId,
    },
  });
  if (offers.length === 0) {
    return 0;
  }
  const ratings = await Promise.all(
    offers.map(async (offer) => {
      const averageRating = await calculateAverageRatingForOffer(offer.id);
      return averageRating;
    }),
  );
  const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
  return totalRating / offers.length;
}

module.exports = {
  calculateAverageRatingForOffer,
  calculateAverageRatingForEnterprise,
};
