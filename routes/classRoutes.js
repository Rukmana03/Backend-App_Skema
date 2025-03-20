const express = require("express");
const classController = require("../controllers/classController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, roleMiddleware("Admin"), classController.createClass);
router.get("/", authenticate, classController.getAllClasses);
router.get("/:id/active", authenticate, classController.getActiveStudentsInClass);
router.get("/:id/subjects", authenticate, classController.getSubjectsByClassId);
router.get("/:id", authenticate, classController.getClassById);
router.put("/move", authenticate, roleMiddleware("Admin"), classController.moveStudentToClass);
router.put("/:id", authenticate, roleMiddleware("Admin"), classController.updateClass);
router.delete("/:id", authenticate, roleMiddleware("Admin"), classController.deleteClass);
router.post("/:id/students", authenticate, roleMiddleware("Admin"), classController.addStudentToClass);

router.put("/:classId/students/:studentId", authenticate, roleMiddleware("Admin"), classController.deactivateStudentInClass);
router.get("/:id/members", authenticate, classController.getClassMembers);

module.exports = router;

// router.post("/:id/teachers", authenticate, roleMiddleware("Admin"), classController.addTeacherToClass);