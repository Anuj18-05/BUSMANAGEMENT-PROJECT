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
   trim:true,
   minlength: [2, "Name must contain at least 2 characters"]
},
feePaid:{
    type :Boolean,
    default:false
},
email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
},
password:{
    type:String,
    required:[true,"Password is required"],
    minlength:6
},
phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    match: [/^[6-9]\d{9}$/, "Enter a valid 10 digit phone number"]
},
    profileImage:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
});
module.exports=mongoose.model("Student",studentSchema);