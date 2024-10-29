// endpoint for users to manage journal entries
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Middleware to check JWT
const Journal = require("../models/Journal"); // Your Journal model
const User = require("../models/User");


// Create journal entry
router.post("/create", auth, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newJournal = new Journal({
      user: req.user.id, // this should already link to the user
      title,
      content,
      username: req.user.username, // Link the username from the token
    });
    const journal = await newJournal.save();
    res.json(journal);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all journal entries for a user
router.get("/allentries", auth, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id });
    res.json(journals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
