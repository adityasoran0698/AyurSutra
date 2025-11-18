const User = require("../models/user");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const Booking = require("../models/booking");

// ✅ Twilio Config (for SMS)
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ Nodemailer Config (with Gmail SMTP / App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
  } catch (err) {}
}

/**
 * ✅ Send SMS via Twilio
 */
async function sendSMS(to, message) {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE, // Twilio number
      to, // patient’s phone
    });
    console.log("📩 SMS sent to", to);
  } catch (err) {
    console.error("❌ SMS send error:", err.message);
  }
}

/**
 * ✅ Send Email via Nodemailer
 */
async function sendEmail(to, subject, message) {
  try {
    await transporter.sendMail({
      from: `"AyurSutra" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    });
    console.log("📧 Email sent to", to);
  } catch (err) {
    console.error("❌ Email send error:", err.message);
  }
}

/**
 * ✅ Master function: Notify patient via In-App, SMS, Email
 */
async function notifyPatient(
  bookingId,
  sessionIndex,
  message,
  subject = "AyurSutra Notification"
) {
  try {
    const booking = await Booking.findById(bookingId).populate("patientId");
    if (!booking || !booking.patientId) {
      throw new Error("Booking or patient not found");
    }

    const patient = booking.patientId;

    // 1. In-App
    await sendInAppNotification(bookingId, sessionIndex, message);

    // 2. SMS

    function formatPhoneNumber(phone, countryCode = "+91") {
      if (!phone.startsWith("+")) {
        return countryCode + phone;
      }
      return phone;
    }

    if (patient.phoneNumber) {
      const formattedPhone = formatPhoneNumber(patient.phoneNumber); // ✅ capture return value
      await sendSMS(formattedPhone, message); // ✅ send formatted number
    }

    // 3. Email
    if (patient.email) {
      await sendEmail(patient.email, subject, message);
    }

    console.log(`✅ Notifications sent to patient: ${patient.fullname}`);
  } catch (err) {
    console.error("❌ Notification error:", err.message);
  }
}

module.exports = { sendInAppNotification, sendSMS, sendEmail, notifyPatient };
