const mongoose = require("mongoose");
const BusSchema= new mongoose.Schema({
busId:{
    
    type:String,
    unique:true,
    required:[true,"Bus Id is required"],
    trim:true
},
route:{ type:String,
    required:[true,"route is required"],
    trim:true
},
timing:{ type:String,
    required:[true,"timing is required"]
},
currentStop:{ type:String,
    required:[true,"currentStop is required"]
},
nextStop:{ type:String,
    required:[true,"nextStop is required"]
},
availableSeats:{
    type:Number,
    required : [true,"Seats are required"],
    min : [1,"atleast 1 seat required"]
},
totalSeats:{
    type:Number,
    required : [true,"Seats are required"],
    min : [1,"atleast must be one seat"]
},
BookedSeats:{
    type:[Number],
    default:[]
},
status:{
    type:String,
    required:[true,"Status is required"],
    enum :["Active","inActive"]
}


});
module.exports=mongoose.model("Bus",BusSchema);