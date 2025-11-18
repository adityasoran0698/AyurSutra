const express = require("express");
const {
  createBooking,
  autoRescheduleSessions,
  autoRescheduleSingleBooking,
} = require("../controllers/bookingController.js");
const Booking = require("../models/booking.js");
const { validateToken } = require("../services/auth.js");

const router = express.Router();

// ✅ Create new booking
router.post("/", createBooking);

// ✅ Run auto-schedule for all confirmed bookings (manual/CRON)
router.patch("/auto-reschedule", autoRescheduleSessions);
router.patch("/:id/auto-schedule", autoRescheduleSingleBooking);

// ✅ Get all bookings for logged-in patient
router.get("/", async (req, res) => {
  try {
    const user = validateToken(req.cookies.token);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No valid token" });
    }

    const bookings = await Booking.find({ patientId: user._id })
      .populate({ path: "therapyId", select: "name duration price" })
      .populate({
        path: "doctorId",
        select: "fullname specialization qualification experience",
      })
      .populate({ path: "patientId", select: "fullname email phoneNumber" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

router.patch("/update/:bookingId", async (req, res) => {
  try {
    const user = validateToken(req.cookies.token);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({ message: "Forbidden: Not a doctor" });
    }

    const { progress, sessions } = req.body; // ✅ also receive sessions

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      {
        ...(progress && { progress }), // ✅ update progress if provided
        ...(sessions && { sessions }), // ✅ update sessions array
      },
      { new: true }
    )
      .populate("therapyId")
      .populate("patientId");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ booking: updatedBooking });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Failed to update patient info" });
  }
});
router.post("/:bookingId/:sessionIndex", async (req, res) => {
  const { bookingId, sessionIndex } = req.params;
  const { feedbackText, pain, stress, energy, sleep } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Update the specific session
    const session = booking.sessions[sessionIndex];
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.feedbackText = feedbackText;
    session.pain = pain;
    session.stress = stress;
    session.energy = energy;
    session.sleep = sleep;

    await booking.save();
    res.json({ message: "Feedback updated successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const booking = await Booking.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete booking" });
  }
});

module.exports = router;
