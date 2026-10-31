const mongoose = require("mongoose");
const studentSchema= new mongoose.Schema({
studentId:{
    type:String,
    unique:true
},
name:String,
feePaid:Boolean
});
module.exports=mongoose.model("Student",studentSchema);