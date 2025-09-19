const Booking = require("../models/booking.js");
const Therapy = require("../models/Therapy.js");
const { validateToken } = require("../services/auth.js");
const { notifyPatient } = require("../utils/notificationService");

const createBooking = async (req, res) => {
  try {
    const { therapyId, doctorId } = req.body;
    const user = validateToken(req.cookies.token);
    const patientId = user._id;

    // 1️⃣ Fetch therapy
    const therapy = await Therapy.findById(therapyId);
    if (!therapy) {
      return res.status(404).json({ message: "Therapy not found" });
    }

    const maxSlotsPerDay = therapy.slotsPerDay || 5; // configurable per therapy

    // 2️⃣ Always start from today
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    let assignedDate = null;

    while (!assignedDate) {
      // Count bookings for this doctor & therapy on the given day
      const count = await Booking.countDocuments({
        therapyId,
        doctorId,
        date: startDate,
      });

      if (count < maxSlotsPerDay) {
        assignedDate = new Date(startDate);
      } else {
        // Move to next day
        startDate.setDate(startDate.getDate() + 1);
      }
    }

    // 3️⃣ Generate sessions based on therapy duration
    const sessions = [];
    for (let i = 0; i < therapy.duration; i++) {
      const sessionDate = new Date(assignedDate);
      sessionDate.setDate(assignedDate.getDate() + i);
      sessions.push({ sessionDate, status: "scheduled" });
    }

    // 4️⃣ Save booking
    const booking = await Booking.create({
      therapyId,
      doctorId,
      patientId,
      date: assignedDate, // ✅ system-chosen date
      sessions,
      progress: {
        completedSessions: 0,
        totalSessions: sessions.length,
      },
      
      status: "confirmed",
    });

    const populatedBooking = await booking.populate([
      { path: "therapyId", select: "name duration price slotsPerDay" },
      {
        path: "doctorId",
        select: "fullname specialization qualification experience",
      },
      { path: "patientId", select: "fullname email phoneNumber" },
    ]);

    // 5️⃣ Notify patient
    await notifyPatient(
      populatedBooking._id,
      0,
      `Hello ${populatedBooking.patientId.fullname}, your therapy "${
        populatedBooking.therapyId.name
      }" has been booked automatically for ${assignedDate.toDateString()} 🧘‍♂️`
    );

    return res.status(201).json({
      message: `Booking confirmed on ${assignedDate.toDateString()}`,
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Failed to create booking" });
  }
};

/**
 *  ✅ Auto-reschedule missed sessions
 *  This can be used in a CRON job or called manually (e.g., when doctor/patient opens dashboard).
 */
const autoRescheduleSessions = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "confirmed" });

    const today = new Date();
    let updatedBookings = [];

    for (const booking of bookings) {
      let updated = false;

      booking.sessions.forEach((session) => {
        if (session.status === "scheduled" && session.sessionDate < today) {
          // If session date has passed but not marked completed
          const nextDate = new Date(today);
          nextDate.setDate(today.getDate() + 1); // schedule it for tomorrow
          session.sessionDate = nextDate;
          updated = true;
        }
      });

      if (updated) {
        await booking.save();
        updatedBookings.push(booking);
      }
    }

    return res.status(200).json({
      message: "Sessions auto-rescheduled successfully",
      updatedBookings,
    });
  } catch (error) {
    console.error("Error auto-rescheduling sessions:", error);
    return res.status(500).json({ message: "Failed to auto-reschedule" });
  }
};
const autoRescheduleSingleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ Only reschedule if confirmed
    if (booking.status !== "confirmed") {
      return res
        .status(400)
        .json({ message: "Booking must be confirmed first" });
    }

    const today = new Date();
    let updated = false;

    booking.sessions.forEach((session) => {
      if (session.status === "scheduled" && session.sessionDate < today) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + 1); // schedule it for tomorrow
        session.sessionDate = nextDate;
        updated = true;
      }
    });

    if (updated) {
      await booking.save();
    }

    return res.status(200).json({
      message: updated
        ? "Booking sessions auto-rescheduled"
        : "No sessions needed rescheduling",
      booking,
    });
  } catch (error) {
    console.error("Error auto-rescheduling single booking:", error);
    return res
      .status(500)
      .json({ message: "Failed to auto-reschedule booking" });
  }
};
module.exports = {
  createBooking,
  autoRescheduleSessions,
  autoRescheduleSingleBooking,
};
