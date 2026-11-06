const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createAdmin = async(req,res)=>{
  try{
  const{ name,email,password}=req.body;
   const exsistingAdmin = await Admin.findOne({email:email});
   if(exsistingAdmin){
    return res.status(409).send("Admin already exists");
   }
   const hashedPassword = await bcrypt.hash(password,10);
   const admin = await Admin.create({name,email,password:hashedPassword});
   if(!admin){
    return res.status(400).send("There is some error while signing");
   }
    res.redirect("/adminLogin.html");
  }
catch(err){
    console.log(err);

    if(err.name === "ValidationError"){
        return res.status(400).send(err.message);
    }

    if(err.code === 11000){
        return res.status(409).send("Email already exists");
    }

    return res.status(500).send("Error creating admin");
}

}
const loginAdmin = async(req,res)=>{
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
}
const adminDashboard =  (req, res) => {
  try{
  res.render("admin/dashboard.ejs");
  }catch(err){
    res.send(500).send("Error");
  }
}
const logoutAdmin =  (req, res) => {
  res.clearCookie("admintoken");
  res.redirect("/adminLogin.html");
}
module.exports = { createAdmin, loginAdmin, adminDashboard, logoutAdmin };