const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 1818;

// 1. connect to mongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/micro-mind")
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Middleware
app.use(express.json());
app.use(cors());

//defined routes
const authRoutes = require("./routes/auth");
const journalRoutes = require("./routes/journal");
app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes); 


//simple route
app.get("/", (req, res) => {
  res.send("Hello World! :)");
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
