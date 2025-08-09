const { sequelize } = require("../../models/index");

async function calculateAverageRatingForOffer(offerId) {
  const ratings = await sequelize.models.Rating.findAll({
    where: {
      Offer_id: offerId,
    },
  });
  if (ratings.length === 0) {
    return null;
  }
  const totalRating = ratings.reduce(
    (acc, rating) => acc + Number(rating.note),
    0,
  );
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
      return averageRating !== undefined ? averageRating : null;
    }),
  );
  const filteredRatings = ratings.filter((rating) => rating !== null);
  if (filteredRatings.length === 0) {
    return 0;
  }
  const totalRating = filteredRatings.reduce((acc, rating) => acc + rating, 0);
  return totalRating / filteredRatings.length;
}

module.exports = {
  calculateAverageRatingForOffer,
  calculateAverageRatingForEnterprise,
};
