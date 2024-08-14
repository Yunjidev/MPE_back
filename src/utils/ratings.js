const { sequelize } = require("../../models/index");

async function calculateAverageRatingForOffer(offerId) {
  const ratings = await sequelize.models.Rating.findAll({
    where: {
      Offer_id: offerId,
    },
  });

  console.log(`Found ${ratings.length} ratings for offer ID: ${offerId}`);

  if (ratings.length === 0) {
    return 0;
  }

  const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  const averageRating = totalRating / ratings.length;

  console.log(`Average rating for offer ID ${offerId} is: ${averageRating}`);

  return averageRating;
}

async function calculateAverageRatingForEnterprise(enterpriseId) {
  const offers = await sequelize.models.Offer.findAll({
    where: {
      Enterprise_id: enterpriseId,
    },
  });

  console.log(`Found ${offers.length} offers for enterprise ID: ${enterpriseId}`);

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
  const averageRating = totalRating / offers.length;

  console.log(`Total rating for enterprise ID ${enterpriseId} is: ${totalRating}`);
  console.log(`Average rating for enterprise ID ${enterpriseId} is: ${averageRating}`);

  return averageRating;
}

module.exports = {
  calculateAverageRatingForOffer,
  calculateAverageRatingForEnterprise,
};
