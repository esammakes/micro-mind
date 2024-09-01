const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 1818;

// 1. connect to mongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/micro-mind") // No need for deprecated options
  .then(() => {
    console.log("Emily, your MongoDB is connected!");

    // Start the server only after the database connection is successful
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Emily, your MongoDB failed to connect:", err);
  });

//Init Middleware
app.use(express.json({ extended: false }));

//defined routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/auth", authRoutes);

//simple route
app.get("/", (req, res) => {
  res.send("Hello World! :)");
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
