const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "supersecret";

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Token failed" });
  }
};

module.exports = protect;
