const mongoose = require("mongoose");
const adminSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength:2

    },
     email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    }
});
module.exports=mongoose.model("Admin",adminSchema);