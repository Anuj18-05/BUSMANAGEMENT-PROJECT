const express =require("express");
const bcrypt =require("bcryptjs");
const jwt =require("jsonwebtoken");
const cookieParser =require("cookie-parser");
require("dotenv").config();

const adminRoutes =require("./routes/adminRoutes");
const bookingRoutes =require("./routes/bookingRoutes");
const StudentRoutes =require("./routes/StudentRoutes");
const BusesRoutes =require("./routes/BusesRoutes");
const PORT = process.env.PORT || 3000;
require("./database");
const Student =require("./models/Student");

const Booking =require("./models/Booking");
const Bus =require("./models/Bus")
const Admin =require("./models/Admin");
const app =express();
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/admin",adminRoutes);
app.use("/bookings",bookingRoutes);
app.use("/students",StudentRoutes);
app.use("/Buses",BusesRoutes);
app.listen(PORT,()=>{
    console.log(`Server Running at port ${PORT}`)
});