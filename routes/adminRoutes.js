const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const router = express.Router();
const Bus =require("../models/Bus");
const Booking =require("../models/Booking");
const Student =require("../models/Student");
const Admin =require("../models/Admin");
router.post("/signup",async(req,res)=>{
  try{
  const{ name,email,password}=req.body;
   const exsistingAdmin = await Admin.findOne({email:email});
   if(exsistingAdmin){
    return res.send("Admin already exists");
   }
   const hashedPassword = await bcrypt.hash(password,10);
    const admin = await Admin.create({name,email,password:hashedPassword});
    res.redirect("/adminLogin.html");
  }
  catch(err){
    console.log(err);
    res.status(500).send("error creating admin");
  }





});
router.post("/login",async(req,res)=>{
const {email,password}=req.body;
try{
  const admin = await Admin.findOne({email:email});
  if(!admin){
    return res.send("Admin not found Invalid Email ");
  }
  const isMatch = await bcrypt.compare(password, admin.password);
  if(!isMatch){
    return res.send("Invalid credentials");
  }
  const token = jwt.sign({id:admin._id,role:"admin"},process.env.JWT_SECRET,{expiresIn:"1h"});
   res.cookie("admintoken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 1000
});


  res.redirect("/admin/");
}
catch(err){
  console.log(err);
  res.status(500).send("error logging in");
}
});
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
router.get("/", adminAuthMiddleware, (req, res) => {
  res.render("admin/dashboard.ejs");
});
router.get("/buses",adminAuthMiddleware, async(req, res) => {
   const buses =await Bus.find(); 
   
 res.render("admin/bus-management.ejs",{
   buses:buses
 });

});
router.get("/buses/add",adminAuthMiddleware,(req,res)=>{
res.render("admin/add-bus.ejs")
});
router.get("/buses/edit/:id",adminAuthMiddleware,async(req,res)=>{
    const bus = await Bus.findById(req.params.id);
      res.render("admin/edit-bus.ejs",{
        bus:bus
      })
    }
);
router.post("/buses/delete/:id",adminAuthMiddleware,async(req,res)=>{
    const existingBooking =await Booking.findOne({
     Bus: req.params.id
     });
     if(existingBooking){
      return res.send("Can't delete this bus because booking exist")
     }
      await  Bus.findByIdAndDelete(req.params.id);
     res.redirect("/admin/buses");
})


router.post("/buses/edit/:id",adminAuthMiddleware,async(req,res)=>{
       await Bus.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.redirect("/admin/buses")
}
);
router.get("/logout", (req, res) => {
  res.clearCookie("admintoken");
  res.redirect("/adminLogin.html");
});

module.exports = router;