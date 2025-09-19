// jobs/sessionReminder.js
const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const { sendSMS, sendEmail } = require("../utils/notificationService");

async function sendPreSessionReminders() {
  const now = new Date();
  const upcoming = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour before

  const bookings = await Booking.find({
    "sessions.sessionDate": { $gte: now, $lte: upcoming },
  }).populate("patientId therapyId");

  for (const booking of bookings) {
    for (const session of booking.sessions) {
      if (
        session.sessionDate >= now &&
        session.sessionDate <= upcoming &&
        session.status === "scheduled"
      ) {
        // Notification message
        const message = `Reminder: Your ${
          booking.therapyId.name
        } session is in 1 hour. Pre-procedure: ${
          session.notifications.find((n) => n.type === "pre-procedure").message
        }`;

        // Send via Email + SMS
        await sendSMS(booking.patientId.phone, message);
        await sendEmail(
          booking.patientId.email,
          "Therapy Session Reminder",
          message
        );

        // ✅ Mark notification as sent
        session.notifications.find(
          (n) => n.type === "pre-procedure"
        ).sent = true;
        session.notifications.find((n) => n.type === "pre-procedure").sentAt =
          new Date();
      }
    }
    await booking.save();
  }
}

module.exports = sendPreSessionReminders;
