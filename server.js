const express =require("express");
const PORT = process.env.PORT || 3000;
require("./database");
const Student =require("./models/Student")
const Booking =require("./models/Booking")
const Bus =require("./models/Bus")
const app =express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.post("/students",async(req,res)=>{
  try{ const student = await Student.create(req.body);
  res.redirect("/booking.html")
    }
   catch(err){
    console.log(err);
    res.status(500).send("eroror Creating student")
   }
});
app.post("/Buses",async(req,res)=>{
  try{ const bus = await Bus.create(req.body);
    res.redirect("/admin/buses");
   }
   catch(err){
    console.log(err);
    res.status(500).send("eroror Creating student")
   }
});
app.post("/Bookings",async(req,res)=>{
  try{ 
  const student = await Student.findOne({
    studentId:req.body.studentId
  });
  if(student===null){
    return res.send("Student Not found")};
    if(!student.feePaid){
       return res.send("Plz Pay Your Bus fee TO book")
    }
 const bus= await Bus.findOne({
    busId:req.body.busId
  });

if(bus===null){ return res.send("Bus not Found")};
if(bus.availableSeats==0){ return res.send("sorry no seat Available i n your desired Bus plz Cheak something else")}
 const existingBooking= await Booking.findOne({student:student._id, Bus:bus._id})
 if(existingBooking){
 return res.send("Already Booked");
 }
 if(bus.availableSeats<=0){
  return res.send("Seats not avaialable");
 }
 if(bus.status=="Inactive"){
  res.send("this bus isn't active yet");
 }
 const now =new Date();
const booking = await Booking.create({ bookingId: "Bk"+Date.now() ,student:student._id,Bus:bus._id ,date:now.toLocaleDateString(),time:now.toLocaleTimeString() });

 await Bus.findByIdAndUpdate(
  booking.Bus,
  {
    availableSeats : bus.availableSeats-1
  }
 );
 res.render("student/booking-success",{
  studentId:student.studentId,
  BusId:bus.busId,
  route:bus.route,
  Date:booking.date,
  Time:booking.time
 })
}
   catch(err){
    console.log(err);
    res.status(500).send("eroror Creating student")
   }
});
app.get("/bookingList",async(req,res)=>{
const studentId =req.query.studentId;
 const student = await Student.findOne({
  studentId:studentId
});
if(!student){
  return res.send("student not found");
}
const bookings =await Booking.find({
  student:student._id
}).populate("Bus");


res.render("student/bookingList.ejs",{
  
  bookings:bookings,
  studentId
  
});
})
app.post("/cancel-booking/:id", async (req, res) => {
  const bookingId = req.params.id;
  const studentId = req.query.studentId;

  try {
    
    const booking = await Booking.findById(bookingId);
    
    
    if (!booking) {
      console.log(`Booking ${bookingId} not found. Redirecting safely...`);
      return res.redirect(`/bookingList?studentId=${studentId}`);
    }

    
    if (booking.Bus) {
      
      await Bus.findByIdAndUpdate(booking.Bus, {
        $inc: { availableSeats: 1 }
      });
    } else {
      console.log(`Warning: Booking found but no associated Bus ID was attached.`);
    }

    
    await Booking.findByIdAndDelete(bookingId);
 
    
    return res.redirect(`/bookingList?studentId=${studentId}`);
 
  } catch (error) {
    
    console.error(" Error handling booking cancellation:", error.message);
    
    
    return res.status(500).send("An error occurred while trying to cancel your booking. Please try again.");
  }
});

app.get("/admin",(req,res)=>{
  res.render("admin/dashboard.ejs")
})
app.get("/admin/buses",async(req,res)=>{
  const buses =await Bus.find();
  
res.render("admin/bus-management.ejs",{
  buses:buses
});
})
app.get("/admin/buses/add",(req,res)=>{
  res.render("admin/add-bus.ejs")
})
app.post("/admin/buses/delete/:id",async(req,res)=>{
 const existingBooking =await Booking.findOne({
 Bus: req.params.id
 });
 if(existingBooking){
  return res.send("Can't delete this bus because booking exist")
 }
  await  Bus.findByIdAndDelete(req.params.id);
 res.redirect("/admin/buses");
})
app.get("/admin/buses/edit/:id",async(req,res)=>{
   const bus = await Bus.findById(req.params.id);
  res.render("admin/edit-bus.ejs",{
    bus:bus
  })
})
app.post("/admin/buses/edit/:id", async(req,res)=>{
  await  await Bus.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res.redirect("/admin/buses")
})
app.get("/student/dashboard",(req,res)=>{
  res.render("student/studentdashboard.ejs")
})
app.get("/student/buses",async(req,res)=>{
  const buses =await Bus.find();
  const studentId =req.query.studentId
  res.render("student/viewbuses.ejs",{
    buses:buses,
    studentId:studentId
  });
})
app.listen(PORT,()=>{
    console.log(`Server Running at port ${PORT}`)
});