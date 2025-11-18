const express = require("express");
const app = express();
require("dotenv").config();

const userRoute = require("./routes/user.js");
const therapyRoute = require("./routes/therapy.js");
const cron = require("node-cron");
const bookingRoute = require("./routes/booking.js");
const blogsRoute = require("./routes/blogs.js");
const port = process.env.PORT || 8000;
const MongodbConnection = require("./connectDB.js");
const url = process.env.MONGO_URL;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

MongodbConnection(url);

// ✅ Middleware
app.use(cookieParser());
// ✅ Allow frontend to send/receive cookies
const allowedOrigins = [
  "https://ayur-sutra-coral.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ⭐ FIX for preflight requests
app.options(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/user", userRoute);
app.use("/therapy", therapyRoute);
app.use("/bookings", bookingRoute);
app.use("/blogs", blogsRoute);

app.listen(port, () => console.log(`Server is running on ${port}`));
