const express = require("express");
const app = express();
const PORT = process.env.PORT || 1818;

app.get("/", (req, res) => {
  res.send("Hello World from Express");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
