const express = require("express");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");

const router = express.Router();
const { validateToken } = require("../services/auth.js");
router.post("/register", async (req, res) => {
  const body = req.body;
  try {
    const user = {
      fullname: body.fullname,
      email: body.email,
      password: body.password,
      phoneNumber: body.phoneNumber,
      role: body.role,
    };
    if (user.role === "doctor") {
      user.specialization = body.specialization;
      user.experience = body.experience;
      user.qualification = body.qualification;
    }
    await User.create(user);
    return res.status(200).send("User registered Successfully");
  } catch (error) {
    return res.status(400).send("Registration Failed!");
  }
});
// In user.js route file
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "fullname specialization qualification experience"
    );
    res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

router.get("/patients", async (req, res) => {
  try {
    const user = validateToken(req.cookies.token);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({ message: "Forbidden: Not a doctor" });
    }

    const patients = await Booking.find({ doctorId: user._id })
      .populate({ path: "therapyId", select: "name duration price" })
      .populate({ path: "patientId", select: "fullname email phoneNumber" })
      .sort({ createdAt: -1 });

    res.status(200).json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found! Register yourself");

    if (user.role === "patient" && role === "doctor")
      return res.status(400).send("Access Denied");

    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).send("Login Successful");
  } catch (error) {
    return res.status(400).send("Login Failed!");
  }
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  const user = validateToken(token);
  return res.json({ user });
});
module.exports = router;
