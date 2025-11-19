const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { generateToken } = require("../services/auth.js");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true, // ✅ changed "require" to "required"
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true, // "doctor" or "patient" or "admin"
  },

  // ✅ Doctor-specific fields (optional for patients)
  specialization: {
    type: String,
    required: function () {
      return this.role === "doctor"; // Only required if user is a doctor
    },
  },
  experience: {
    type: Number,
    min: 0,
    required: function () {
      return this.role === "doctor";
    },
  },
  qualification: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },
 
});

// Hash password before saving
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = bcryptjs.hashSync(user.password, 10);
  next();
});

// Static method for login
UserSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User Not Found!");

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect email or password");
    }
    return generateToken(user);
  }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
