const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    console.log("The decoded user is : ",req.user)
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

exports.verifyAdmin = async (req, res, next) => {
  await exports.verifyToken(req, res, async () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  });
};
