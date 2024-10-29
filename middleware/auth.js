const jwt = require("jsonwebtoken");

// Middleware to authenticate the user
module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header("Authorization")?.split(" ")[1]; // Split "Bearer token"

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );
    req.user = decoded.user; // Attach the user from the token payload to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
