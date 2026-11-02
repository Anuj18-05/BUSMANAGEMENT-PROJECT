const express= require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student =require("../models/Student");
const Bus =require("../models/Bus");
router.post("/",async(req,res)=>{
  try{ 
    const existingStudent = await Student.findOne({studentId: req.body.studentId});
   
   if (!req.body.name || !req.body.studentId || !req.body.email || !req.body.password) {
  return res.status(400).send("All fields are required");
}
  
     const { name, studentId, email, password } = req.body;
const ExistingStudent = await Student.findOne({ email });
  if (ExistingStudent) {
    return res.status(400).send( "Student already exists");
  };
    if (existingStudent) {
      return res.status(400).send("Student with this ID already exists");
    };
  const hashedPassword = await bcrypt.hash(password, 10);
   const data = { name, studentId, email, password: hashedPassword };
  const student = await Student.create(data);  
  res.redirect("/studentLogin.html")
    }
   catch (err) {
    console.log(err);

    if (err.code === 11000) {
        return res.status(409).send("Student ID already exists");
    }

    if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
    }

    res.status(500).send("Internal Server Error");
}
});
const studentAuthMiddleware = (req, res, next) => {
const token = req.cookies.token;
if (!token) {
  return res.status(401).send("Access denied. No token provided.");
}
try{
const decoded =jwt.verify(token,process.env.JWT_SECRET);
req.user = decoded;
next();


}
catch (err) {
  console.error(err);
  res.status(401).send("invalid token");
}
};
router.get("/dashboard", studentAuthMiddleware, (req, res) => {
  res.render("student/studentdashboard.ejs")
});
router.get("/buses",async(req,res)=>{
  const buses =await Bus.find();
  const studentId =req.query.studentId
  res.render("student/viewbuses.ejs",{
    buses:buses,
    studentId:studentId
  });
});

router.post("/login",async(req,res)=>{
  try{
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).send("Invalid email or password");
    }
    const match = await bcrypt.compare(password,student.password);
    if (!match) {
      return res.status(400).send("Invalid credientials");
    }
    const token =   jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 1000
});

res.redirect("/students/dashboard");

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/studentLogin.html");
});

module.exports = router;