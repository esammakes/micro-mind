// an endpoint for users to register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// user registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // creating new user
    user = new User({
      username,
      email,
      password,
    });

    // hash the password - crypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save user into the database
    await user.save();

    // JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "default_secret", // Replace with a more secure key in production
      { expiresIn: 3600 }, // 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// user login
router.post("/login", async (req, res) => {
  console.log("login hit");
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    // does the user exist?
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials: Username" });
    }
    // is their password a match too?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Invalid Credentials: Password Match" });
    }

    // generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload, // The payload should be the first argument
      process.env.JWT_SECRET || "default_secret", // The secret key should be the second argument
      { expiresIn: 3600 }, // Options like expiration time are the third argument
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
