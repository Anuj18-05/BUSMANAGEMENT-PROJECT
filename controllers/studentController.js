const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Bus =require("../models/Bus");
const createStudent = async(req,res)=>{
  try{ 
    
   
   if (!req.body.name || !req.body.email || !req.body.password || !req.body.phoneNumber) {
  return res.status(400).send("All fields are required");
}
  
     const { name, email, password ,feePaid, phoneNumber } = req.body;
const ExistingStudent = await Student.findOne({ email });
  if (ExistingStudent) {
    return res.status(400).send( "Student already exists");
  };
  
  const hashedPassword = await bcrypt.hash(password, 10);
   const data = { name, studentId: "STU" + Math.floor(Math.random() * 1000), email, password: hashedPassword, feePaid, phoneNumber, profileImage: req.body.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"   };
  const student = await Student.create(data);  
  res.redirect("/studentLogin.html")
    }
   catch (err) {
    console.log(err);

    if (err.code === 11000) {
        return res.status(409).send("Student ID ,email or phoneNumber already exists");
    }

    if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
    }

    res.status(500).send("Internal Server Error");
}
}
const loginStudent = async(req,res)=>{
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
    const token =   jwt.sign({ studentId: student._id,role: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
}
const logoutStudent =  (req, res) => {
  res.clearCookie("token");
  res.redirect("/studentLogin.html");
}
const studentdashboard =  (req, res) => {
  res.render("student/studentdashboard.ejs")
}
const viewbuses = async(req,res)=>{
  const buses =await Bus.find();
  res.render("student/viewbuses.ejs",{
    buses:buses,
    studentId:req.user.studentId
  });
}
const viewprofile = async (req, res) => {
    try {const studentId= req.user.studentId;
    
    const studentdata = await Student.findById( studentId );
    if(!studentdata) {
        return res.status(404).send("Student not found");
    }
    res.render("student/profile.ejs", { studentdata });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong while fetching the profile.");
    }
}
const editprofile = async (req, res) => {
  const studentId = req.user.studentId;
  const studentdata = await Student.findById(studentId);
  res.render("student/editprofile.ejs", { studentdata });
}
const updateProfile = async (req, res) => { const studentId = req.user.studentId;
  const { name, email, phoneNumber, profileImage } = req.body;
  await Student.findByIdAndUpdate(studentId, { name, email, phoneNumber, profileImage });
  res.redirect("/students/profile")};


module.exports = { viewprofile, editprofile, updateProfile ,createStudent,loginStudent,logoutStudent ,studentdashboard,viewbuses};