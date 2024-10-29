const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  //   const token = req.header("x-auth-token");
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from 'Bearer <token>'

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );
    req.user = decoded.user; // Attach user information to the request
    next(); // Proceed to the next middleware
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
