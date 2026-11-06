const Bus =require("../models/Bus");
const Booking = require("../models/Booking")
const createBus =async(req,res)=>{
  try{ const bus = await Bus.create(req.body);
    res.redirect("/admin/buses");
   }
  catch(err) {
    console.log("Bus catch running");
    console.log(err);

    if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
    }

    if (err.code === 11000) {
        return res.status(400).send("Bus ID already exists");
    }

    return res.status(500).send("Server error while creating bus");
}
   }
   const getAllBuses =  async(req, res) => {
     try{
    const buses =await Bus.find(); 
      
    res.render("admin/bus-management.ejs",{
      buses:buses
    });
  }
  catch(err){
    return res.status(500).send("Something Went Wrong");
  }
   }
   const getBusById = (req,res)=>{
res.render("admin/add-bus.ejs")
}
const getBusByIdForEdit = async(req,res)=>{
  try{
  const bus = await Bus.findById(req.params.id);
  if(!bus){
    return res.status(500).send("Can't edit right now bus not found");
  }
      res.render("admin/edit-bus.ejs",{
        bus:bus
      })
    }
    catch(err){
      return res.status(500).send("Server Error");
    }
    }
    const deleteBus = async(req,res)=>{
     try{
      const existingBooking =await Booking.findOne({
         Bus: req.params.id
         });
         if(existingBooking){
          return res.send("Can't delete this bus because booking exist")
         }
        const bus=  await  Bus.findByIdAndDelete(req.params.id);
          if(!bus){
            return res.status(404).send("Bus not Found")
          }
         res.redirect("/admin/buses");
        }
        catch(err){
          return res.status(500).send("Server Error While Deleting Bus");
        }
    }
    const updateBus = async(req,res)=>{
      try{
        await Bus.findByIdAndUpdate(
        req.params.id,
        req.body,
        {runValidators:true}
      );
      res.redirect("/admin/buses");
    }
     catch(err) {
        console.log(err);

        if (err.name === "ValidationError") {
            return res.status(400).send(err.message);
        }

        if (err.code === 11000) {
            return res.status(400).send("Bus ID already exists");
        }

        return res.status(500).send("Server error while updating bus");
    }
}
   module.exports = {createBus, getAllBuses, getBusById, getBusByIdForEdit, deleteBus, updateBus};