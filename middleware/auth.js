const jwt = require("jsonwebtoken");

//middleware to authenticate user
module.exports = function (req, res, next) {
  //get token from the header
  // const token = req.header("Authorization")?.split(" ")[1]; // Split "Bearer token"
  const token = req.header("Authorization").replace("Bearer ", "");

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );
    req.user = decoded.user; //attach the user from the token payload to the request
    next(); //proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
