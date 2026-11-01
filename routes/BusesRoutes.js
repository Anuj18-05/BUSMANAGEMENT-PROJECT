const express = require("express");
const router = express.Router();
const Student =require("../models/Student");
const Bus =require("../models/Bus");
router.post("/",async(req,res)=>{
  try{ const bus = await Bus.create(req.body);
    res.redirect("/admin/buses");
   }
   catch(err){
    console.log(err);}
   });
   module.exports = router;