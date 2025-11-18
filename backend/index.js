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
const _dirname = path.resolve();
// ✅ Allow frontend to send/receive cookies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/user", userRoute);
app.use("/therapy", therapyRoute);
app.use("/bookings", bookingRoute);
app.use("/blogs", blogsRoute);

app.listen(port, () => console.log(`Server is running on ${port}`));
