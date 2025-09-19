const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    therapyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "therapie",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // doctors stored in User model
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // patient stored in User model
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    // ✅ Track multiple sessions automatically
    sessions: [
      {
        sessionDate: { type: Date, required: true },
        status: {
          type: String,
          enum: ["scheduled", "completed", "missed"],
          default: "scheduled",
        },

        // Notifications per session
        notifications: [
          {
            type: {
              type: String,
              enum: ["pre-procedure", "post-procedure","in-app"],
              required: true,
            },
            message: { type: String, required: true },
            sent: { type: Boolean, default: false },
            sentAt: { type: Date },
          },
        ],

        // Feedback & ratings
        feedbackText: { type: String, trim: true }, // AI/ML analysis
        improvementRating: { type: Number, min: 1, max: 5 },
        pain: { type: Number, min: 0, max: 10 },
        stress: { type: Number, min: 0, max: 10 },
        energy: { type: Number, min: 0, max: 10 },
        sleep: {
          type: String,
          enum: ["poor", "average", "good"],
          default: "average",
        },

        // AI/ML calculated fields
        sentiment: { type: String }, // optional: positive/negative/neutral
        improvementScore: { type: Number }, // optional: 0-10 scale
      },
    ],

    // Progress tracking
    progress: {
      completedSessions: { type: Number, default: 0 },
      totalSessions: { type: Number, default: 1 },
      recoveryNotes: { type: String },
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
