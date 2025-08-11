const { sequelize } = require('../../../models/index');
const Enterprise = sequelize.models.Enterprise;
const { Job, User, Country } = require('../../../models/index');
const { calculateAverageRatingForEnterprise } = require('../../utils/ratings');
const { getAvailabilityDates } = require('../../utils/availability');

exports.getAllEnterprisesValidate = async (req, res) => {
  try {
    const enterprises = await Enterprise.findAll({
      where: { isValidate: true },
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'User_id',
          'Job_id',
          'Country_id',
          'facebook',
          'instagram',
          'twitter',
          'description',
          'isValidate',
          'phone',
          'mail',
          'adress',
          'siret_number',
        ],
      },
      include: [
        {
          model: sequelize.models.User,
          as: 'entrepreneur',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'password',
              'resetPasswordToken',
              'resetPasswordExpires',
              'isEntrepreneur',
              'isAdmin',
              'firstname',
              'lastname',
              'email',
            ],
          },
        },
        {
          model: sequelize.models.Job,
          as: 'job',
          attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        },
        {
          model: sequelize.models.Country,
          as: 'country',
          attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        },
        {
          model: sequelize.models.Disponibility,
          as: 'disponibilities',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id', 'Enterprise_id'],
          },
        },
        {
          model: sequelize.models.Indisponibility,
          as: 'indisponibilities',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id', 'Enterprise_id'],
          },
        },
        {
          model: sequelize.models.Offer,
          as: 'offers',
          include: [
            {
              model: sequelize.models.Reservation,
              as: 'reservations',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'Offer_id'],
              },
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'Enterprise_id'],
          },
        },
      ],
    });

    const enterpriseWithDetails = await Promise.all(
      enterprises.map(async (enterprise) => {
        // Ici les logo/photos sont déjà des URLs Cloudinary stockées
        const averageRating = await calculateAverageRatingForEnterprise(
          enterprise.id
        );
        const availabilityDates = getAvailabilityDates(
          enterprise.disponibilities,
          enterprise.indisponibilities,
          enterprise.offers.map((offer) => offer.reservations).flat()
        );

        return {
          ...enterprise.toJSON(),
          averageRating,
          availabilityDates,
          nextAvalaibleDate: availabilityDates[0],
        };
      })
    );

    res.status(200).json(enterpriseWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error.message });
  }
};

exports.getEnterpriseByIdValidate = async (req, res) => {
  try {
    const { id } = req.params;
    const enterprise = await Enterprise.findByPk(id, {
      include: [
        {
          model: sequelize.models.Job,
          as: 'job',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: sequelize.models.User,
          as: 'entrepreneur',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'password',
              'resetPasswordToken',
              'resetPasswordExpires',
              'isEntrepreneur',
            ],
          },
        },
        {
          model: sequelize.models.Country,
          as: 'country',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: sequelize.models.Disponibility,
          as: 'disponibilities',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id', 'Enterprise_id'],
          },
        },
        {
          model: sequelize.models.Indisponibility,
          as: 'indisponibilities',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id', 'Enterprise_id'],
          },
        },
        {
          model: sequelize.models.Offer,
          as: 'offers',
          include: [
            {
              model: sequelize.models.Reservation,
              as: 'reservations',
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'Offer_id'],
              },
            },
            {
              model: sequelize.models.Rating,
              as: 'ratings',
              attributes: {
                exclude: ['updatedAt', 'Enterprise_id'],
              },
              include: [
                {
                  model: sequelize.models.User,
                  as: 'user',
                  attributes: {
                    exclude: [
                      'createdAt',
                      'updatedAt',
                      'password',
                      'resetPasswordToken',
                      'resetPasswordExpires',
                      'isEntrepreneur',
                      'isAdmin',
                      'firstName',
                      'lastName',
                      'email',
                    ],
                  },
                },
              ],
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'Enterprise_id'],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'User_id', 'Job_id', 'Country_id'],
      },
    });

    if (!enterprise) {
      return res.status(404).json({ errors: 'Pas de Enterprise trouvée' });
    }
    if (!enterprise.isValidate) {
      return res.status(404).json({ errors: "L'entreprise n'est pas validée" });
    }

    // Les champs logo / photos sont déjà des URLs Cloudinary
    const averageRating = await calculateAverageRatingForEnterprise(id);
    const availabilityDates = getAvailabilityDates(
      enterprise.disponibilities,
      enterprise.indisponibilities,
      enterprise.offers.map((offer) => offer.reservations).flat()
    );

    const enterpriseData = {
      ...enterprise.toJSON(),
      averageRating,
      availabilityDates,
      nextAvalaibleDate: availabilityDates[0],
    };

    res.status(200).json(enterpriseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: error.message });
  }
};
