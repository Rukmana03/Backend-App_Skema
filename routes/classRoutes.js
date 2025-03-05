const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { authenticate, roleMiddleware} = require("../middleware/authMiddleware");

router.use(authenticate, roleMiddleware("Admin"));

router.post("/", classController.createClass);
router.get("/", classController.getAllClasses);
router.get("/:id", classController.getClassById);
router.put("/:id", classController.updateClass);
router.delete("/:id", classController.deleteClass);
router.post("/:id/students", classController.addStudentToClass);
router.post("/:id/teachers", classController.addTeacherToClass);

module.exports = router;
