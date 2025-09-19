const express = require("express");
const app = express();
require("dotenv").config();

const userRoute = require("./routes/user.js");
const therapyRoute = require("./routes/therapy.js");
const cron = require("node-cron");
const sendPreSessionReminders = require("./jobs/sessionReminder");
const bookingRoute = require("./routes/booking.js");
const port = 8000;
const MongodbConnection = require("./connectDB.js");
const url = process.env.MONGO_URL;
const cors = require("cors");
const cookieParser = require("cookie-parser");

MongodbConnection(url);

// ✅ Middleware
app.use(cookieParser());

// ✅ Allow frontend to send/receive cookies
app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend
    credentials: true, // IMPORTANT: allow cookies
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
cron.schedule("*/15 * * * *", () => {
  console.log("⏰ Running pre-session reminders...");
  sendPreSessionReminders();
});

// ✅ Routes
app.use("/user", userRoute);
app.use("/therapy", therapyRoute);
app.use("/bookings", bookingRoute);

app.listen(port, () => console.log(`Server is running on ${port}`));
