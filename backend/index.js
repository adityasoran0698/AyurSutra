const express = require("express");
const app = express();
require("dotenv").config();

const userRoute = require("./routes/user.js");
const therapyRoute = require("./routes/therapy.js");
const cron = require("node-cron");
const bookingRoute = require("./routes/booking.js");
const blogsRoute = require("./routes/blogs.js");
const port = 8000;
const MongodbConnection = require("./connectDB.js");
const url = process.env.MONGO_URL;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

MongodbConnection(url);

// ✅ Middleware
app.use(cookieParser());
const _dirname = path.resolve();
// ✅ Allow frontend to send/receive cookies
app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend
    credentials: true, // IMPORTANT: allow cookies
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/user", userRoute);
app.use("/therapy", therapyRoute);
app.use("/bookings", bookingRoute);
app.use("/blogs", blogsRoute);
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(port, () => console.log(`Server is running on ${port}`));
