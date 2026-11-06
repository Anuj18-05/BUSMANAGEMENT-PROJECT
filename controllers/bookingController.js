const Bus =require("../models/Bus");
const Booking =require("../models/Booking");
const Student =require("../models/Student");
const createBooking =async(req,res)=>{
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
  const seatNumber = Number(req.body.seatNumber);
  if (bus.BookedSeats.includes(seatNumber)) {
    return res.send("Seat already booked. Please choose another seat.");
  }
  if ( !Number.isInteger(seatNumber)||seatNumber < 1 || seatNumber > bus.totalSeats) {
    return res.send("Invalid seat number. Please choose a valid seat.");
  }


 const existingBooking= await Booking.findOne(
  {student:student._id, Bus:bus._id, status:{$ne:"cancelled"}})
 if(existingBooking){
 return res.send("Already Booked");
 }
 const updatedBus = await Bus.findOneAndUpdate(
  { _id: bus._id, 
    availableSeats: { $gt: 0 },
  status:"Active",
  BookedSeats: { $ne: seatNumber }
 },

  { $inc: { availableSeats: -1 },
$addToSet: { BookedSeats: seatNumber } },
  { returnDocument : "after" }
);
if(!updatedBus){
  return res.send("Seats not available or Bus isn't active yet");
}
 const now =new Date();
const booking = await Booking.create({ bookingId: "Bk"+Date.now() ,student:student._id,Bus:bus._id ,date:now.toLocaleDateString(),time:now.toLocaleTimeString(), SeatNumber: seatNumber });
if(!booking){
  return res.status(404).send("There is some error while booking ! try again")
}
 res.render("student/booking-success",{
  studentId:student.studentId,
  BusId:bus.busId,
  route:bus.route,
  Date:booking.date,
  Time:booking.time,
  status:booking.status,
  seatNumber:booking.SeatNumber
  
 })
}
  catch(err){
    console.log(err);

    if(err.name === "ValidationError" || err.name === "CastError"){
        return res.status(400).send(err.message);
    }

    if(err.code === 11000){
        return res.status(409).send("Booking already exists");
    }

    return res.status(500).send("Error creating booking");
}
}
const bookingList =async(req,res)=>{
 
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
}
const cancelBooking =async (req, res) => {
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
    const updatebus=  await Bus.findByIdAndUpdate(booking.Bus, {
        $inc: { availableSeats: 1 },
        $pull: { BookedSeats: booking.SeatNumber }
       
      });
      if(!updatebus){
        res.send("Associated Bus not found")
      }
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
}
const selectSeat =async (req, res) => {
  const busId = req.params.id;
  const studentId = req.user.studentId;
  

  try {
    console.log(req.params.id);
    console.log(req.user);
   
    const bus = await Bus.findOne({ busId: busId });
    if (!bus) {
  return res.status(404).send("Bus not found");
}
   res.render("student/SeatNumber",{
    busId:bus.busId,
    route:bus.route,
    totalSeats:bus.totalSeats,
    BookedSeats:bus.BookedSeats,
    studentId:studentId
   })



  } catch (error) {
    console.error("Error fetching bus:", error.message);
    return res.status(500).send("An error occurred while trying to fetch the bus. Please try again.");
  }

}
module.exports={createBooking ,bookingList,cancelBooking ,selectSeat};