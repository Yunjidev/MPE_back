const { sequelize } = require("../../models/index");
const Reservation = sequelize.models.Reservation;

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
    const { date, status, Offer_id, User_id } = req.body;
    const Offer = sequelize.models.Offer;
    if (!Offer.findByPk(Offer_id)) {
      return res.status(404).json({ message: "Pas d'offre trouvée" });
    }
    const User = sequelize.models.User;
    if (!User.findByPk(User_id)) {
      return res.status(404).json({ message: "Pas d'utilisateur trouvé" });
    }
    const newReservation = await Reservation.create({
      date,
      status,
      Offer_id,
      User_id,
    });
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Pas de reservation trouvée" });
    }
    reservation.date = date || reservation.date;
    reservation.status = status || reservation.status;
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
