const express = require("express");
const router = express.Router();
const Blog = require("../models/Blogs.js");
const User = require("../models/user.js");

router.get("/all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("doctor", "fullname email");
    return res.status(200).send({ blogs });
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
});

router.post("/add-blogs/:id", async (req, res) => {
  const body = req.body;
  try {
    const blogs = await Blog.create({
      title: body.title,
      category: body.category,
      shortDesc: body.shortDesc,
      fullDesc: body.fullDesc,
      doctor: req.params.id,
    });
    return res.status(200).send("Blog Added Successfully");
  } catch (error) {
    return res.status(500).json({ Error: error });
  }
});

module.exports = router;
