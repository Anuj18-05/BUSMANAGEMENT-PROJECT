const express = require("express");
const router = express.Router();
const Bus =require("../models/Bus");
const Booking =require("../models/Booking");
const Student =require("../models/Student");
const studentAuthMiddleware = require("../Middleware/studentAuthMiddleware");
router.post("/",studentAuthMiddleware,async(req,res)=>{
  try{ 
  const student = await Student.findOne({
   _id: req.user.studentId
   } );
  if(student===null){
    return res.send("Student Not found")};
    if(!student.feePaid){
       return res.send("Plz Pay Your Bus fee TO book")
    }
 const bus= await Bus.findOne({
    busId:req.body.busId
  });

if(bus===null){ return res.send("Bus not Found")};
 const existingBooking= await Booking.findOne(
  {student:student._id, Bus:bus._id, status:{$ne:"cancelled"}})
 if(existingBooking){
 return res.send("Already Booked");
 }
 if(bus.availableSeats<=0){
  return res.send("Seats not avaialable");
 }
 if(bus.status=="Inactive"){
  return res.send("this bus isn't active yet");
 }
 const now =new Date();
const booking = await Booking.create({ bookingId: "Bk"+Date.now() ,student:student._id,Bus:bus._id ,date:now.toLocaleDateString(),time:now.toLocaleTimeString() });

 await Bus.findByIdAndUpdate(
  booking.Bus,
  {
    $inc: { availableSeats: -1 }
  }
 );
 res.render("student/booking-success",{
  studentId:student.studentId,
  BusId:bus.busId,
  route:bus.route,
  Date:booking.date,
  Time:booking.time,
  status:booking.status
 })
}
   catch(err){
    console.log(err);
    res.status(500).send("eroror Creating student")
   }
});
router.get("/list",studentAuthMiddleware,async(req,res)=>{
 
 try{
 
 const student = await Student.findOne({
  _id:req.user.studentId
});
if(!student){
  return res.send("student not found");
}
const bookings =await Booking.find({
  student:student._id
}).populate("Bus");


res.render("student/bookingList.ejs",{
  
  bookings:bookings,
  studentId:req.user.studentId
  
});
}
catch(err){
  console.log(err);
  res.status(500).send("Error fetching bookings");
}
});
router.post("/cancel/:id",studentAuthMiddleware, async (req, res) => {
  const bookingId = req.params.id;
  const studentId = req.user.studentId;

  try {
    
    const booking = await Booking.findOne({ _id: bookingId, student:studentId });
    
    
    if (!booking) {
      console.log(`Booking ${bookingId} not found. Redirecting safely...`);
      return res.redirect("/bookings/list");
    }

    
    if (booking.Bus) {
      if(booking.status === "cancelled"){
        console.log(`Booking ${bookingId} is already cancelled. No action taken.`);
        return res.redirect("/bookings/list");
      }
      await Bus.findByIdAndUpdate(booking.Bus, {
        $inc: { availableSeats: 1 }
      });
    } else {
      console.log(`Warning: Booking found but no associated Bus ID was attached.`);
    }

    booking.status = "cancelled";
    await booking.save();
  
 
    
    return res.redirect("/bookings/list");
 
  } catch (error) {
    
    console.error(" Error handling booking cancellation:", error.message);
    
    
    return res.status(500).send("An error occurred while trying to cancel your booking. Please try again.");
  }
});


module.exports = router;

