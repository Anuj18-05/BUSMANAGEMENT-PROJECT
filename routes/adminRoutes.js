const express = require("express");
const adminAuthMiddleware = require("../Middleware/adminAuthMiddleware");
require("dotenv").config();
const router = express.Router();
const adminController = require("../controllers/adminController");
const Admin =require("../models/Admin");
const buscontroller = require("../controllers/busController");
router.post("/signup", adminController.createAdmin);
router.post("/login", adminController.loginAdmin);
router.get("/", adminAuthMiddleware, adminController.adminDashboard);
router.get("/buses",adminAuthMiddleware,buscontroller.getAllBuses);
router.get("/buses/add",adminAuthMiddleware,buscontroller.getBusById);
router.get("/buses/edit/:id",adminAuthMiddleware,buscontroller.getBusByIdForEdit);
router.post("/buses/delete/:id",adminAuthMiddleware,buscontroller.deleteBus);
router.post("/buses/edit/:id",adminAuthMiddleware,buscontroller.updateBus);
router.get("/logout", adminAuthMiddleware, adminController.logoutAdmin);

module.exports = router;