const mongoose = require("mongoose");

const therapySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in days (each day = one session)
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ Default therapy-level instructions (used to populate sessions later)
    instructions: {
      pre: { type: [String], default: [] },
      post: { type: [String], default: [] },
    },

    // ✅ Sessions (auto-generated from duration)
    sessions: [
      {
        day: { type: Number, required: true }, // e.g., Day 1, Day 2, ...
        notifications: [
          {
            type: {
              type: String,
              enum: ["pre-procedure", "post-procedure"],
              required: true,
            },
            message: { type: String, required: true },
            sent: { type: Boolean, default: false },
            sentAt: { type: Date },
          },
        ],
      },
    ],
    // in therapySchema
    slotsPerDay: {
      type: Number,
      default: 5, // doctor can take 5 bookings per day by default
    },
  },
  { timestamps: true }
);

const Therapy = mongoose.model("therapie", therapySchema);
module.exports = Therapy;
