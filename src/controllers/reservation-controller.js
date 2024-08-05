const { sequelize } = require("../../models/index");
const Reservation = sequelize.models.Reservation;
const {
  calculateRemainingAvailability,
  isDateInAvailability,
  calculateEndTime,
} = require("../utils/availability");

exports.getAllReservations = async (req, res) => {
  try {
    const reservation = await Reservation.findAll();
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Pas de reservation trouvée" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.User_id;
    const now = new Date();
    const { date, start_time } = req.body;
    const offer = await sequelize.models.Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: "Pas d'offre trouvée" });
    }
    const user = sequelize.models.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Pas d'utilisateur trouvé" });
    }
    if (user.id === offer.enterprise.User_id) {
      return res
        .status(400)
        .json({ message: "Vous ne pouvez pas reserver votre propre offre" });
    }
    if (date < now) {
      return res
        .status(400)
        .json({ message: "La date doit être dans le futur" });
    }
    const remainingAvailability = await calculateRemainingAvailability(
      offer.Enterprise_id,
    );
    const isAvailable = isDateInAvailability(
      date,
      start_time,
      offer.duration,
      remainingAvailability,
    );
    const endTime = calculateEndTime(start_time, offer.duration);
    if (!isAvailable) {
      return res.status(400).json({ message: "Date non disponible" });
    }

    const newReservation = await Reservation.create({
      date,
      start_time,
      end_time: endTime,
      status: "pending",
      Offer_id: id,
      User_id: userId,
    });
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.User_id;
    const user = await sequelize.models.User.findByPk(userId);
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
      return res.status(404).json({ message: "Pas de reservation trouvée" });
    }
    const isReservationOwner = reservation.User_id === userId;
    const isReservationOfferOwner =
      reservation.offer.enterprise.User_id === userId;

    if (user.isAdmin) {
      reservation.status = status || status;
      reservation.date = date || reservation.date;
      reservation.start_time = start_time || reservation.start_time;
      await reservation.save();
      res.status(200).json(reservation);
    }
    if (!isReservationOwner && !isReservationOfferOwner) {
      return res
        .status(403)
        .json({ message: "Vous n'êtes pas autorisé à effectuer cette action" });
    }
    if (isReservationOwner) {
      if (status && status === "cancelled") {
        reservation.status = "cancelled";
      } else if (date && reservation.status === "pending") {
        const remainingAvailability = await calculateRemainingAvailability(
          reservation.offer.Enterprise_id,
        );
        const isAvailable = isDateInAvailability(
          date,
          reservation.start_time,
          reservation.offer.duration,
          remainingAvailability,
        );
        const endTime = calculateEndTime(
          reservation.start_time,
          reservation.offer.duration,
        );
        if (!isAvailable) {
          return res.status(400).json({ message: "Date non disponible" });
        }
        reservation.date = date;
        reservation.start_time = start_time;
        reservation.end_time = endTime;
      } else if (status && reservation.status !== "pending") {
        return res.status(400).json({
          message: "Vous ne pouvez pas changer le statut de la reservation",
        });
      } else {
        return res.status(400).json({ message: "Operation non autorisée" });
      }
    }
    if (isReservationOfferOwner) {
      const now = new Date();
      if (status === "accepted" || status === "rejected") {
        reservation.status = status;
      } else if (
        status === "done" &&
        reservation.status === "accepted" &&
        reservation.date > now &&
        reservation.end_time > now
      ) {
        reservation.status = "done";
      } else {
        return res.status(400).json({
          message: "Vous ne pouvez pas changer le statut de la reservation",
        });
      }
    }
    await reservation.save();
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Pas de reservation trouvée" });
    }
    await reservation.destroy();
    res.status(200).json({ message: "reservation supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
