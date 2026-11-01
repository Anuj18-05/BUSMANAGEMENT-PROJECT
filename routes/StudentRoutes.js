const express= require("express");
const router = express.Router();
const Student =require("../models/Student");
const Bus =require("../models/Bus");
router.post("/",async(req,res)=>{
  try{ const student = await Student.create(req.body);
  res.redirect("/booking.html")
    }
   catch(err){
    console.log(err);
    res.status(500).send("eroror Creating student")
   }
});
router.get("/dashboard",(req,res)=>{
  res.render("student/studentdashboard.ejs")
});
router.get("/buses",async(req,res)=>{
  const buses =await Bus.find();
  const studentId =req.query.studentId
  res.render("student/viewbuses.ejs",{
    buses:buses,
    studentId:studentId
  });
})
module.exports = router;