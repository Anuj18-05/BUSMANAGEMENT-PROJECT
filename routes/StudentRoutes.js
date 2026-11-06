const express= require("express");
const router = express.Router();
const studentAuthMiddleware = require("../Middleware/studentAuthMiddleware");
const studentcontroller = require("../controllers/studentController");
router.post("/", studentcontroller.createStudent);

router.get("/dashboard", studentAuthMiddleware, studentcontroller.studentdashboard);
router.get("/buses",studentAuthMiddleware,studentcontroller.viewbuses);

router.post("/login", studentcontroller.loginStudent);
router.get("/logout", studentcontroller.logoutStudent);
router.get("/profile",studentAuthMiddleware, studentcontroller.viewprofile);
router.get("/editprofile", studentAuthMiddleware, studentcontroller.editprofile);
router.post("/updateprofile", studentAuthMiddleware, studentcontroller.updateProfile);
module.exports = router;