const User = require("../models/user");
const Booking = require("../models/booking");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

// ---------------------------------------
// TWILIO CLIENT
// ---------------------------------------
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ---------------------------------------
// NODEMAILER TRANSPORT
// ---------------------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------------------------------------
// HELPERS
// ---------------------------------------

/** Format phone number */
const formatPhoneNumber = (phone, code = "+91") =>
  phone.startsWith("+") ? phone : code + phone;

/** In-App Notification */
async function sendInAppNotification(bookingId, sessionIndex, message) {
  try {
    await Booking.updateOne(
      { _id: bookingId },
      {
        $push: {
          [`sessions.${sessionIndex}.notifications`]: {
            type: "in-app",
            message,
            createdAt: new Date(),
          },
        },
      }
    );
  } catch (err) {
    console.error("❌ In-app notification error:", err.message);
  }
}

/** SMS Notification */
async function sendSMS(to, message) {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });
    console.log("📩 SMS sent:", to);
  } catch (err) {
    console.error("❌ SMS error:", err.message);
  }
}

/** Email Notification */
async function sendEmail(to, subject, message) {
  try {
    await transporter.sendMail({
      from: `"AyurSutra" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    });

    console.log("📧 Email sent:", to);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
}

// ---------------------------------------
// MAIN: Notify Patient (RUNS IN BACKGROUND)
// ---------------------------------------

async function notifyPatient(
  bookingId,
  sessionIndex,
  message,
  subject = "AyurSutra Notification"
) {
  try {
    const booking = await Booking.findById(bookingId).populate("patientId");
    if (!booking || !booking.patientId) {
      console.error("❌ Patient not found for booking", bookingId);
      return;
    }

    const patient = booking.patientId;

    // 👉 RUN ALL NOTIFICATIONS IN PARALLEL — NON BLOCKING!
    const tasks = [];

    // In-App (always)
    tasks.push(sendInAppNotification(bookingId, sessionIndex, message));

    // SMS (if phone available)
    if (patient.phoneNumber) {
      const phone = formatPhoneNumber(patient.phoneNumber);
      tasks.push(sendSMS(phone, message));
    }

    // Email (if email available)
    if (patient.email) {
      tasks.push(sendEmail(patient.email, subject, message));
    }

    // ✔ Do NOT await — let them run asynchronously
    Promise.allSettled(tasks).then((results) => {
      console.log("📨 Notification tasks finished:", results.length);
    });

    console.log(`🚀 Notification queued for: ${patient.fullname}`);
  } catch (err) {
    console.error("❌ notifyPatient error:", err.message);
  }
}

module.exports = {
  sendInAppNotification,
  sendSMS,
  sendEmail,
  notifyPatient,
};
