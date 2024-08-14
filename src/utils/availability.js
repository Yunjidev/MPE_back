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

  console.log(`Subtracting from slots: Start - ${startTime}, End - ${endTime}`);
  console.log(`Original Slots: `, slots);

  const updatedSlots = slots.flatMap((slot) => {
    const slotStart = convertToMinutes(slot.start);
    const slotEnd = convertToMinutes(slot.end);

    if (start >= slotEnd || end <= slotStart) {
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

  console.log(`Updated Slots: `, updatedSlots);
  return updatedSlots;
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
  const endTime = `${endHour.toString().padStart(2, "0")}:${endMin
    .toString()
    .padStart(2, "0")}`;
  return endTime;
};

async function calculateRemainingAvailability(Enterprise_id) {
  try {
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

  const daysofWeek = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const availabilityByDay = daysofWeek.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});

  disponibilities.forEach((dispo) => {
    const day = dispo.day;
    if (!Array.isArray(availabilityByDay[day])) {
      console.error(`availabilityByDay[${day}] is not an array.`);
      availabilityByDay[day] = []; // Assurez-vous que c'est un tableau.
    }
    console.log(`Pushing to availabilityByDay[${day}]`);
    availabilityByDay[day].push({
      start: dispo.start_hour,
      end: dispo.end_hour,
    });
  });
  console.log("Initial availability by day:", availabilityByDay);

  indisponibilities.forEach((indispo) => {
    const startDay = indispo.start_date.getDay();
    const endDay = indispo.end_date.getDay();
    const startTime = indispo.start_hour;
    const endTime = indispo.end_hour;

    const today = new Date();
    const todayDay = today.getDay();

    for (let day = todayDay; day <= endDay; day++) {
      const dayName = getDayName(day);

      if (availabilityByDay[dayName] && availabilityByDay[dayName].length > 0) {
        availabilityByDay[dayName] = subtractTimeSlot(
          availabilityByDay[dayName],
          startTime,
          endTime,
        );
      }
    }
  });

  reservations.forEach((reservation) => {
    const startDay = reservation.date.getDay();
    const endDay = reservation.date.getDay();
    const startTime = reservation.start_time;
    const endTime = reservation.end_time;

    const today = new Date();
    const todayDay = today.getDay();

    for (let day = todayDay; day <= endDay; day++) {
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

  console.log("Final availability by day:", availabilityByDay);
    return availabilityByDay;
  } catch (error) {
    console.error('Error in calculateRemainingAvailability:', error);
    throw error; // Rethrow l'erreur pour la gérer à un niveau supérieur.
  }
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

const getNextAvailableDate = (remainingAvailability) => {
  const today = new Date();
  const currentHour = today.getHours();
  const currentMinutes = today.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;

  const dayOfWeek = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() + i);
    const dayName = dayOfWeek[currentDate.getDay()];

    console.log(`Checking availability for: ${dayName}`);

    if (remainingAvailability[dayName]) {
      for (let slot of remainingAvailability[dayName]) {
        let slotStartMinutes = convertToMinutes(slot.start);
        let slotEndMinutes = convertToMinutes(slot.end);

        // Si c'est aujourd'hui et l'heure actuelle dépasse le début du créneau, ajuster le créneau
        if (i === 0 && currentTimeInMinutes > slotStartMinutes) {
          if (currentTimeInMinutes < slotEndMinutes) {
            console.log(
              `Adjusting slot start time from ${slot.start} to ${convertToTime(currentTimeInMinutes)}`,
            );
            slot.start = convertToTime(currentTimeInMinutes);
            slotStartMinutes = currentTimeInMinutes;
          } else {
            console.log(
              `Ignoring slot: ${slot.start} - ${slot.end} because it has already passed.`,
            );
            continue;
          }
        }

        // Vérifier si le créneau est déjà passé
        if (i === 0 && slotEndMinutes < currentTimeInMinutes) {
          console.log(
            `Ignoring slot: ${slot.start} - ${slot.end} because it has already passed.`,
          );
          continue;
        }

        const slotDate = new Date(currentDate);
        const [startHour, startMin] = slot.start.split(":").map(Number);
        slotDate.setHours(startHour, startMin, 0, 0);

        console.log(
          `Checking slot: ${slot.start} - ${slot.end} on ${slotDate}`,
        );

        // Retourner le créneau s'il est après l'heure actuelle
        if (slotDate.getTime() > today.getTime()) {
          console.log(`Next available slot: ${slotDate}`);
          return slotDate.toISOString();
        }
      }
    }
  }
  return null;
};
module.exports = {
  getDayName,
  subtractTimeSlot,
  addMinutes,
  calculateRemainingAvailability,
  isDateInAvailability,
  calculateEndTime,
  getNextAvailableDate,
};
