const moment = require("moment");

const isDateBetween = (date, startDate, endDate) => {
  const dateMoment = moment(date, "DD/MM");
  const startDateMoment = moment(startDate, "DD/MM");
  const endDateMoment = moment(endDate, "DD/MM");
  return dateMoment.isBetween(startDateMoment, endDateMoment, null, "[]");
};

const calculateEndTime = (startTimeString, duration) => {
  const startTime = moment(startTimeString, "HH:mm");
  return startTime.add(duration, "minutes").format("HH:mm");
};

const formatDisponibility = (disponibility) => {
  const dayOfWeek = disponibility.day;
  const startHour = moment(disponibility.start_hour, "HH:mm").format("HH:mm");
  const endHour = moment(disponibility.end_hour, "HH:mm").format("HH:mm");

  const today = moment().startOf("day");
  const dayIndex = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ].indexOf(dayOfWeek);
  let nextOccurence = today.clone().day(dayIndex);
  if (nextOccurence.isBefore(today)) {
    nextOccurence.add(1, "week");
  }

  let dates = [];
  for (let i = 0; i < 4; i++) {
    const date = nextOccurence.clone().add(i, "week");
    if (
      date.isSameOrAfter(today) &&
      date.isBefore(today.clone().add(1, "month").endOf("month"))
    ) {
      dates.push({
        date: date.format("DD/MM"),
        startHour,
        endHour,
      });
    } else {
      break;
    }
  }
  return dates;
};

const getAvailabilityDates = (
  disponibilities,
  indisponibilities,
  reservations,
) => {
  if (!Array.isArray(disponibilities)) {
    console.error(
      "Les disponibilités ne sont pas un tableau ou sont indéfinies",
    );
    return [];
  }

  if (!Array.isArray(indisponibilities)) {
    console.error(
      "Les indisponibilités ne sont pas un tableau ou sont indéfinies",
    );
    return [];
  }

  if (!Array.isArray(reservations)) {
    console.error("Les réservations ne sont pas un tableau ou sont indéfinies");
    return [];
  }
  const availabilityDates = disponibilities.flatMap(formatDisponibility);

  const filteredAvailabilityDates = subtractIndisponibilities(
    availabilityDates,
    indisponibilities,
  );

  const finalAvailabilityDates = subtractReservations(
    filteredAvailabilityDates,
    reservations,
  );

  return finalAvailabilityDates;
};

const subtractIndisponibilities = (availabilityDates, indisponibilities) => {
  const filteredAvailabilityDates = [];

  availabilityDates.forEach((availabilityDate) => {
    let startHour = moment(availabilityDate.startHour, "HH:mm").format("HH:mm");
    let endHour = moment(availabilityDate.endHour, "HH:mm").format("HH:mm");

    indisponibilities.forEach((indisponibility) => {
      const startDate = indisponibility.start_date;
      const endDate = indisponibility.end_date;
      const startHourIndispo = moment(
        indisponibility.start_hour,
        "HH:mm",
      ).format("HH:mm");
      const endHourIndispo = moment(indisponibility.end_hour, "HH:mm").format(
        "HH:mm",
      );

      if (isDateBetween(availabilityDate.date, startDate, endDate)) {
        if (startHourIndispo <= startHour && endHourIndispo >= endHour) {
          startHour = null;
          endHour = null;
        } else if (startHourIndispo > startHour && endHourIndispo < endHour) {
          filteredAvailabilityDates.push({
            date: availabilityDate.date,
            startHour: startHour,
            endHour: startHourIndispo,
          });
          startHour = endHourIndispo;
        } else if (startHourIndispo <= startHour) {
          startHour = endHourIndispo;
        } else if (endHourIndispo >= endHour) {
          endHour = startHourIndispo;
        }
      }
    });

    if (startHour && endHour) {
      const duration = moment(endHour, "HH:mm").diff(
        moment(startHour, "HH:mm"),
        "minutes",
      );

      if (duration >= 15 && startHour !== endHour) {
        filteredAvailabilityDates.push({
          date: availabilityDate.date,
          startHour: startHour,
          endHour: endHour,
        });
      }
    }
  });

  return filteredAvailabilityDates;
};

const subtractReservations = (availabilityDates, reservations) => {
  const filteredAvailabilityDates = [];

  availabilityDates.forEach((availabilityDate) => {
    let startHour = moment(availabilityDate.startHour, "HH:mm").format("HH:mm");
    let endHour = moment(availabilityDate.endHour, "HH:mm").format("HH:mm");

    reservations.forEach((reservation) => {
      const reservationDate = moment(reservation.date).format("DD/MM");
      const reservationStartHour = moment(
        reservation.start_time,
        "HH:mm",
      ).format("HH:mm");
      const reservationEndHour = moment(reservation.end_time, "HH:mm").format(
        "HH:mm",
      );

      if (reservationDate === availabilityDate.date) {
        if (
          reservationStartHour <= startHour &&
          reservationEndHour >= endHour
        ) {
          startHour = null;
          endHour = null;
        } else if (
          reservationStartHour > startHour &&
          reservationEndHour < endHour
        ) {
          filteredAvailabilityDates.push({
            date: availabilityDate.date,
            startHour: startHour,
            endHour: reservationStartHour,
          });
          startHour = reservationEndHour;
        } else if (reservationStartHour <= startHour) {
          startHour = reservationEndHour;
        } else if (reservationEndHour >= endHour) {
          endHour = reservationStartHour;
        }
      }
    });

    if (startHour && endHour) {
      const duration = moment(endHour, "HH:mm").diff(
        moment(startHour, "HH:mm"),
        "minutes",
      );

      if (duration >= 15 && startHour !== endHour) {
        filteredAvailabilityDates.push({
          date: availabilityDate.date,
          startHour: startHour,
          endHour: endHour,
        });
      }
    }
  });

  return filteredAvailabilityDates;
};

module.exports = {
  formatDisponibility,
  getAvailabilityDates,
  calculateEndTime,
};
