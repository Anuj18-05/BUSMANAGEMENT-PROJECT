const mongoose = require("mongoose");
const studentSchema= new mongoose.Schema({

    studentId:{
    type:String,
    required:[true,"Id is required"],
    unique:true,
    trim:true
},
name:{
   type: String,
   required:[true,"THis field is required"],
   trim:true
},
feePaid:{
    type :Boolean,
    default:false
},
email:{
    type:String,
    required:[true,"Email is required"],
    unique:true
},
password:{
    type:String,
    required:[true,"Password is required"],
    minlength:6
}
});
module.exports=mongoose.model("Student",studentSchema);