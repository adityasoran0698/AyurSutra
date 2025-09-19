// controllers/sessionController.js
const Booking = require("../models/booking");
const { sendSMS, sendEmail } = require("../utils/notificationService");

async function markSessionComplete(req, res) {
  try {
    const { bookingId, sessionId } = req.body;
    const booking = await Booking.findById(bookingId).populate(
      "patientId therapyId"
    );
    const session = booking.sessions.id(sessionId);

    session.status = "completed";

    // Post-procedure message
    const postMsg = session.notifications.find(
      (n) => n.type === "post-procedure"
    ).message;
    const message = `Your ${booking.therapyId.name} session is completed. Post-procedure advice: ${postMsg}`;

    // Send notifications
    await sendSMS(booking.patientId.phone, message);
    await sendEmail(booking.patientId.email, "Therapy Completed", message);

    // ✅ Mark as sent
    session.notifications.find((n) => n.type === "post-procedure").sent = true;
    session.notifications.find((n) => n.type === "post-procedure").sentAt =
      new Date();

    await booking.save();

    res.json({
      success: true,
      message: "Session marked complete and notification sent",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { markSessionComplete };
