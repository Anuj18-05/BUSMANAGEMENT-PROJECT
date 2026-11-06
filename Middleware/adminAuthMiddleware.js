
const jwt = require("jsonwebtoken");
const adminAuthMiddleware = (req, res, next) => {
  const token = req.cookies.admintoken;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.role !== "admin"){
      return res.status(403).send("Access denied. Not an admin.");
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};
module.exports = adminAuthMiddleware;