const jwt = require("jsonwebtoken");

const studentAuthMiddleware = (req, res, next) => {
const token = req.cookies.token;
if (!token) {
  return res.status(401).send("Access denied. No token provided.");
}
try{
const decoded =jwt.verify(token,process.env.JWT_SECRET);
if(decoded.role !== "student"){
  return res.status(403).send("Access denied. Not a student.");
}
req.user = decoded;
next();


}
catch (err) {
  console.error(err);
  res.status(401).send("invalid token");
}
};
module.exports = studentAuthMiddleware;