const mongoose = require("mongoose");
const BusSchema= new mongoose.Schema({
busId:{
    type:String,
    unique:true
},
route:String,
timing:String,
currentStop:String,
nextStop:String,
availableSeats:Number,
totalSeats:Number,
status:String


});
module.exports=mongoose.model("Bus",BusSchema);