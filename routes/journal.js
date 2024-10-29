const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Journal = require("../models/Journal");

// Route to create a new journal entry
router.post("/create", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const newJournal = new Journal({
      user: req.user.id, // Use the user ID from the token payload
      title,
      content,
    });

    await newJournal.save();
    res.json(newJournal);
  } catch (error) {
    console.error("Error creating journal entry:", error);
    res.status(500).send("Server error");
  }
});

// Route to get all journal entries for the authenticated user
router.get("/allentries", auth, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }); // Find entries by user ID
    res.json(journals);
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).send("Server error");
  }
});

// Route to delete a journal entry by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ msg: "Journal entry not found" });
    }

    // Ensure the journal belongs to the authenticated user
    if (journal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await journal.remove();
    res.json({ msg: "Journal entry removed" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
