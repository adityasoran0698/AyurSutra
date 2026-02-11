const express = require("express");
const Therapy = require("../models/Therapy.js");
const { validateToken } = require("../services/auth.js");
const router = express.Router();

router.post("/add-therapy", async (req, res) => {
  try {
    const body = req.body;
    const user = await validateToken(req.cookies.token);
    const therapy = await Therapy.create({
      name: body.name,
      description: body.description,
      duration: body.duration,
      price: body.price,
      createdBy: user._id,
    });
    await therapy.populate("createdBy", "fullname email phoneNumber role");

    return res.status(200).json({ message: "Therapy Added Successfully!" });
  } catch (error) {
    return res.status(400).json({ message: "Error in adding a therapy" });
  }
});
// GET all therapies
router.get("/", async (req, res) => {
  try {
    const therapies = await Therapy.find({ isActive: true });
    res.status(200).json({ therapies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch therapies" });
  }
});

// GET single therapy by ID
router.get("/:id", async (req, res) => {
  try {
    const therapy = await Therapy.findById(req.params.id);
    if (!therapy) {
      return res.status(404).json({ message: "Therapy not found" });
    }
    res.status(200).json({ therapy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch therapy" });
  }
});

module.exports = router;
