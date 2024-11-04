//newer code
// endpoint for users to manage journal entries
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Middleware to check JWT
const Journal = require("../models/Journal"); // Your Journal model

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
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all journal entries for a user
router.get("/allentries", auth, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }); // Make sure this uses req.user.id
    res.json(journals);
  } catch (err) {
    console.error("Error fetching journals:", err);
    res.status(500).send("Server error");
  }
});

// Generate a report of filtered journal entries - 
router.get("/report", auth, async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    let filter = { user: req.user.id }; // Filter entries for current user

    // Add date filtering if specified
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const journals = await Journal.find(filter);
    const stats = {
      totalEntries: journals.length,
      averageContentLength:
        journals.length > 0
          ? journals.reduce((acc, entry) => acc + entry.content.length, 0) /
            journals.length
          : 0,
    };

    res.json({ journals, stats });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).send("Server error");
  }
});

//route to edit a journal entry
router.put("/edit/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    let journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ msg: "Journal not found" });
    }

    //check if the journal belongs to current user
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //update the journal fields
    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { $set: { title, content } },
      { new: true } //return the updated document
    );

    res.json(journal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const deletedJournal = await Journal.findByIdAndDelete(req.params.id);
    if (!deletedJournal) {
      return res.status(404).json({ msg: "Journal entry not found" });
    }
    res.json({ msg: "Journal entry deleted" });
  } catch (err) {
    console.error("Error deleting journal entry: ", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
