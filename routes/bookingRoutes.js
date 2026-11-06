const express = require("express");
const router = express.Router();
const bookingController =require("../controllers/bookingController");
const studentAuthMiddleware = require("../Middleware/studentAuthMiddleware");
router.post("/",studentAuthMiddleware,bookingController.createBooking);
router.get("/list",studentAuthMiddleware,bookingController.bookingList);
router.post("/cancel/:id",studentAuthMiddleware, bookingController.cancelBooking);
router.get("/SeatNumber/:id",studentAuthMiddleware, bookingController.selectSeat);

module.exports = router;

