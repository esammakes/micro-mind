const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors

const app = express();
const PORT = 1818; //process.env.PORT || 

//use CORS middleware
app.use(cors());

//use JSON middleware
app.use(express.json());

//your routes here
const authRoutes = require("./routes/auth");
const journalRoutes = require("./routes/journal");

app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/micro-mind")
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
