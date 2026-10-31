const mongoose = require("mongoose");
const BookingSchema= new mongoose.Schema({
bookingId:{
type:String,
unique:true
},
student:{
type:mongoose.Schema.Types.ObjectId,
ref:"Student"
},
Bus:{
type:mongoose.Schema.Types.ObjectId,
ref:"Bus"
},
date: String,
time: String
});
module.exports=mongoose.model("Booking",BookingSchema);