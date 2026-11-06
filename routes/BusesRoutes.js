const express = require("express");
const router = express.Router();
const buscontroller = require("../controllers/busController");
const Bus =require("../models/Bus");
router.post("/",buscontroller.createBus);
   module.exports = router;