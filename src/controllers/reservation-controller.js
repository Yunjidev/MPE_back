const { sequelize } = require("../../models/index");
const { Op } = require("sequelize");
const Reservation = sequelize.models.Reservation;
const Offer = sequelize.models.Offer;
const Enterprise = sequelize.models.Enterprise;
const {
  calculateEndTime,
  getAvailabilityDates,
} = require("../utils/availability");
const moment = require("moment-timezone");

exports.getAllReservations = async (req, res) => {
  try {
    const reservation = await Reservation.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "Enterprise_id", "User_id"],
      },
      include: [
        {
          model: sequelize.models.Offer,
          as: "offer",
          attributes: {
            exclude: ["createdAt", "updatedAt", "Enterprise_id", "id"],
          },
          include: {
            model: sequelize.models.Enterprise,
            as: "enterprise",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "id",
                "User_id",
                "Job_id",
                "Country_id",
                "phone",
                "mail",
                "adress",
                "city",
                "zip_code",
                "isValidate",
                "facebook",
                "instagram",
                "twitter",
                "siret_number",
                "description",
                "website",
                "photos",
              ],
            },
          },
        },
        {
          model: sequelize.models.User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "isAdmin",
              "isEntrepreneur",
              "password",
              "resetPasswordToken",
              "resetPasswordExpires",
            ],
          },
        },
      ],
    });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "Enterprise_id", "id", "User_id"],
      },
      include: [
        {
          model: sequelize.models.Offer,
          as: "offer",
          attributes: {
            exclude: ["createdAt", "updatedAt", "Enterprise_id", "id"],
          },
          include: {
            model: sequelize.models.Enterprise,
            as: "enterprise",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "id",
                "User_id",
                "Job_id",
                "Country_id",
                "phone",
                "mail",
                "adress",
                "city",
                "zip_code",
                "isValidate",
                "facebook",
                "instagram",
                "twitter",
                "siret_number",
                "description",
                "website",
                "photos",
              ],
            },
          },
        },
        {
          model: sequelize.models.User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "isAdmin",
              "isEntrepreneur",
              "password",
              "resetPasswordToken",
              "resetPasswordExpires",
            ],
          },
        },
      ],
    });
    if (!reservation) {
      return res.status(404).json({ message: "Pas de reservation trouvée" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getReservationsByEnterpriseId = async (req, res) => {
  try {
    const enterpriseId = req.enterprise.id;
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Offer,
          as: "offer",
          where: {
            Enterprise_id: enterpriseId,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "Enterprise_id", "id"],
          },
          include: {
            model: Enterprise,
            as: "enterprise",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "id",
                "User_id",
                "Job_id",
                "Country_id",
                "phone",
                "mail",
                "adress",
                "city",
                "zip_code",
                "isValidate",
                "facebook",
                "instagram",
                "twitter",
                "siret_number",
                "description",
                "website",
                "photos",
              ],
            },
          },
        },
        {
          model: sequelize.models.User,
          as: "user",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "isAdmin",
              "isEntrepreneur",
              "password",
              "resetPasswordToken",
              "resetPasswordExpires",
            ],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "Enterprise_id", "User_id"],
      },
    });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const { date, start_time } = req.body;
    const offer = await sequelize.models.Offer.findByPk(id);
    const enterprise = await offer.getEnterprise();
    if (!offer) {
      return res.status(404).json({ errors: "Pas d'offre trouvée" });
    }
    if (!req.user) {
      return res.status(404).json({ errors: "Pas d'utilisateur trouvé" });
    }
    if (req.user.id === enterprise.User_id) {
      return res
        .status(400)
        .json({ errors: "Vous ne pouvez pas réserver votre propre offre" });
    }
    if (date < now) {
      return res
        .status(400)
        .json({ errors: "La date doit être dans le futur" });
    }

    const disponibilities = await enterprise.getDisponibilities();
    const indisponibilities = await enterprise.getIndisponibilities();
    const reservations = await Reservation.findAll({
      where: {
        Offer_id: {
          [Op.in]: (await enterprise.getOffers()).map((offer) => offer.id),
        },
      },
    });

    const isAvailable = !reservations.some((reservation) => {
      if (reservation.date === date) {
        const startTime = moment(start_time, "HH:mm");
        const endTime = calculateEndTime(startTime, offer.duration);
        const reservationStartTime = moment(reservation.start_time, "HH:mm");
        const reservationEndTime = moment(reservation.end_time, "HH:mm");
        if (
          (startTime >= reservationStartTime &&
            startTime < reservationEndTime) ||
          (endTime > reservationStartTime && endTime <= reservationEndTime) ||
          (startTime <= reservationStartTime && endTime >= reservationEndTime)
        ) {
          return true;
        }
      }
      return false;
    });

    if (!isAvailable) {
      return res
        .status(400)
        .json({ errors: "Le créneau horaire est déjà réservé" });
    }

    const newReservation = await Reservation.create({
      date,
      start_time,
      end_time: calculateEndTime(start_time, offer.duration),
      status: "pending",
      Offer_id: id,
      User_id: req.user.id,
    });
    res.status(201).json({ message: "Réservation créée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, start_time, status } = req.body;
    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: sequelize.models.Offer,
          as: "offer",
          include: [
            {
              model: sequelize.models.Enterprise,
              as: "enterprise",
            },
          ],
        },
      ],
    });
    if (!reservation) {
      return res.status(404).json({ errors: "Pas de reservation trouvée" });
    }
    const isReservationOwner = reservation.User_id === req.user.id;
    const isReservationOfferOwner =
      reservation.offer.enterprise.User_id === req.user.id;

    if (req.user.isAdmin) {
      reservation.status = status || reservation.status;
      reservation.date = date || reservation.date;
      reservation.start_time = start_time || reservation.start_time;
    }
    if (!isReservationOwner && !isReservationOfferOwner && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ errors: "Vous n'êtes pas autorisé à effectuer cette action" });
    }
    if (isReservationOwner) {
      if (status && status === "cancelled") {
        reservation.status = "cancelled";
      } else if (date && reservation.status === "pending") {
        const enterprise = reservation.offer.enterprise;
        const disponibilities = await enterprise.getDisponibilities();
        const indisponibilities = await enterprise.getIndisponibilities();
        const reservations = await Reservation.findAll({
          where: {
            Offer_id: {
              [Op.in]: (await enterprise.getOffers()).map((offer) => offer.id),
            },
          },
        });

        const isAvailable = !reservations.some((otherReservation) => {
          if (otherReservation.date === date) {
            const startTime = moment(start_time, "HH:mm");
            const endTime = calculateEndTime(
              startTime,
              reservation.offer.duration,
            );
            const otherReservationStartTime = moment(
              otherReservation.start_time,
              "HH:mm",
            );
            const otherReservationEndTime = moment(
              otherReservation.end_time,
              "HH:mm",
            );
            if (
              (startTime >= otherReservationStartTime &&
                startTime < otherReservationEndTime) ||
              (endTime > otherReservationStartTime &&
                endTime <= otherReservationEndTime) ||
              (startTime <= otherReservationStartTime &&
                endTime >= otherReservationEndTime)
            ) {
              return true;
            }
          }
          return false;
        });

        if (!isAvailable) {
          return res
            .status(400)
            .json({ errors: "Le créneau horaire est déjà réservé" });
        }

        reservation.date = date;
        reservation.start_time = start_time;
        reservation.end_time = calculateEndTime(
          start_time,
          reservation.offer.duration,
        );
        reservation.status = reservation.status;
      } else {
        reservation.date = date || reservation.date;
        reservation.start_time = start_time || reservation.start_time;
        reservation.end_time = calculateEndTime(
          start_time || reservation.start_time,
          reservation.offer.duration,
        );
        reservation.status = reservation.status;
      }
    }
    const timezone = "Europe/Paris";
    if (isReservationOfferOwner) {
      const now = moment.tz(timezone);
      if (status === "accepted" || status === "rejected") {
        reservation.status = status;
      } else if (status === "done" && reservation.status === "accepted") {
        const reservationDate = new Date(reservation.date);
        const formattedDate = reservationDate.toISOString().split("T")[0];
        const reservationEndDateTime = moment.tz(
          `${formattedDate} ${reservation.end_time}`,
          "YYYY-MM-DD HH:mm",
          timezone,
        );
        if (reservationEndDateTime < now) {
          reservation.status = "done";
        } else {
          return res.status(400).json({
            errors: "La date de fin de la réservation doit être dans le futur",
          });
        }
      } else {
        return res.status(400).json({
          errors: "Vous ne pouvez pas changer le statut de la reservation",
        });
      }
    }
    await reservation.save();
    res.status(200).json({ message: "Réservation modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ errors: "Pas de reservation trouvée" });
    }
    await reservation.destroy();
    res.status(200).json({ message: "reservation supprimée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
