const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors

const app = express();
const PORT = process.env.PORT || 1818;

// Use CORS middleware
app.use(cors());

// Use JSON middleware
app.use(express.json());

// Your routes here
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

// const express = require("express");
// const mongoose = require("mongoose");
// const app = express();
// const PORT = process.env.PORT || 1818;

// // Middleware to parse JSON bodies
// app.use(express.json());

// // MongoDB connection
// mongoose
//   .connect("mongodb://127.0.0.1:27017/micro-mind", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected!");
//     // Start the server only after the MongoDB connection is successful
//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB:", err);
//   });

// // API routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/journals", require("./routes/journal"));
