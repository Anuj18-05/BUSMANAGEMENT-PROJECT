const mongoose = require("mongoose");
const BookingSchema= new mongoose.Schema({
bookingId:{
type:String,
required:[true,"Booking Id is required"],
trim:true,
unique:true
},
student:{
type:mongoose.Schema.Types.ObjectId,
ref:"Student",
required:[true,"student reference is required"]
},
Bus:{
type:mongoose.Schema.Types.ObjectId,
ref:"Bus",
required:[true,"Bus reference is required"]
},
date: {
    type:String,
required:[true,"Booking date is required"]},
time: {
    type:String,
required:[true,"Booking time is required"]},
status:{
type:String,
default:"booked",
enum :["booked","cancelled"]
},
SeatNumber:{
type:Number,
required:[true,"SeatNumber is required"],
min:[1,"Seat number must be atleast one"]
}
});
module.exports=mongoose.model("Booking",BookingSchema);