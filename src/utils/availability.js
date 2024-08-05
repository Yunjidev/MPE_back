const {
  Disponibility,
  Indisponibility,
  Reservation,
  Offer,
} = require("../../models/index");

function getDayName(dayIndex) {
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  return days[dayIndex];
}

function convertToMinutes(time) {
  const [hour, mins] = time.split(":").map(Number);
  return hour * 60 + mins;
}

const convertToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

function subtractTimeSlot(slots, startTime, endTime) {
  const start = convertToMinutes(startTime);
  const end = convertToMinutes(endTime);

  return slots.flatMap((slot) => {
    const slotStart = convertToMinutes(slot.start);
    const slotEnd = convertToMinutes(slot.end);

    if (start >= slotEnd || end <= slotStart) {
      // No overlap
      return [slot];
    }

    const newSlots = [];

    if (start > slotStart) {
      newSlots.push({ start: slot.start, end: convertToTime(start) });
    }

    if (end < slotEnd) {
      newSlots.push({ start: convertToTime(end), end: slot.end });
    }

    return newSlots;
  });
}

function addMinutes(time, minutes) {
  const [hour, mins] = time.split(":").map(Number);
  const newMinutes = mins + minutes;
  const newHour = hour + Math.floor(newMinutes / 60);
  return `${newHour % 24}:${newMinutes % 60}`;
}

const calculateEndTime = (startTime, duration) => {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const endHour = startHour + Math.floor((startMin + duration) / 60);
  const endMin = (startMin + duration) % 60;
  const endTime = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;
  return endTime;
};

async function calculateRemainingAvailability(Enterprise_id) {
  const disponibilities = await Disponibility.findAll({
    where: {
      Enterprise_id,
    },
  });
  const indisponibilities = await Indisponibility.findAll({
    where: {
      Enterprise_id,
    },
  });
  const reservations = await Reservation.findAll({
    include: [
      {
        model: Offer,
        as: "offer",
        where: {
          Enterprise_id,
        },
      },
    ],
  });

  const availabilityByDay = disponibilities.reduce((acc, dispo) => {
    const day = dispo.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push({
      start: dispo.start_hour,
      end: dispo.end_hour,
    });
    return acc;
  }, {});

  indisponibilities.forEach((indispo) => {
    const startDay = indispo.start_date.getDay();
    const endDay = indispo.end_date.getDay();
    const startTime = indispo.start_hour;
    const endTime = indispo.end_hour;

    for (let day = startDay; day <= endDay; day++) {
      const dayName = getDayName(day);
      if (!availabilityByDay[dayName]) {
        availabilityByDay[dayName] = [];
      }
      availabilityByDay[dayName] = subtractTimeSlot(
        availabilityByDay[dayName],
        startTime,
        endTime,
      );
    }
  });

  reservations.forEach((reservation) => {
    console.log(reservation.start_date);
    const startDay = reservation.date.getDay();
    const endDay = reservation.date.getDay();
    const startTime = reservation.start_time;
    const endTime = reservation.end_time;

    for (let day = startDay; day <= endDay; day++) {
      const dayName = getDayName(day);
      if (!availabilityByDay[dayName]) {
        availabilityByDay[dayName] = [];
      }
      availabilityByDay[dayName] = subtractTimeSlot(
        availabilityByDay[dayName],
        startTime,
        endTime,
      );
    }
  });

  return availabilityByDay;
}

const isDateInAvailability = (
  date,
  startTime,
  duration,
  remainingAvailability,
) => {
  const reservationDate = new Date(Date.parse(date));
  const DayName = getDayName(reservationDate.getDay());
  const endTime = calculateEndTime(startTime, duration);

  if (!remainingAvailability[DayName]) {
    return false;
  }
  return remainingAvailability[DayName].some(
    (slot) => slot.start <= startTime && slot.end >= endTime,
  );
};

module.exports = {
  getDayName,
  subtractTimeSlot,
  addMinutes,
  calculateRemainingAvailability,
  isDateInAvailability,
  calculateEndTime,
};
