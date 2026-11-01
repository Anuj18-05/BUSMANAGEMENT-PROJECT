const express = require("express");
const router = express.Router();
const Bus =require("../models/Bus");
const Booking =require("../models/Booking");
router.get("/", (req, res) => {
  res.render("admin/dashboard.ejs");
});
router.get("/buses", async(req, res) => {
   const buses =await Bus.find(); 
 res.render("admin/bus-management.ejs",{
   buses:buses
 });

});
router.get("/buses/add",(req,res)=>{
res.render("admin/add-bus.ejs")
});
router.get("/buses/edit/:id",async(req,res)=>{
    const bus = await Bus.findById(req.params.id);
      res.render("admin/edit-bus.ejs",{
        bus:bus
      })
    }
);
router.post("/buses/delete/:id",async(req,res)=>{
    const existingBooking =await Booking.findOne({
     Bus: req.params.id
     });
     if(existingBooking){
      return res.send("Can't delete this bus because booking exist")
     }
      await  Bus.findByIdAndDelete(req.params.id);
     res.redirect("/admin/buses");
})


router.post("/buses/edit/:id",async(req,res)=>{
       await Bus.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.redirect("/admin/buses")
}
);

module.exports = router;