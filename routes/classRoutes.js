const express = require("express");
const classController = require("../controllers/classController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, roleMiddleware("Admin"), classController.getAllClasses);
router.get("/:id", authenticate, roleMiddleware("Admin"), classController.getClassById);
router.get("/:id/active", authenticate, roleMiddleware("Admin", "Teacher"), classController.getActiveStudentsInClass);
router.get("/:id/subjects", authenticate, roleMiddleware("Admin", "Teacher"), classController.getSubjectsByClassId);
router.get("/:id/members", authenticate, roleMiddleware("Admin"), classController.getClassMembers);

router.post("/", authenticate, roleMiddleware("Admin"), classController.createClass);
router.post("/:id/students", authenticate, roleMiddleware("Admin"), classController.addStudentToClass);

router.put("/:id", authenticate, roleMiddleware("Admin"), classController.updateClass);
router.put("/move", authenticate, roleMiddleware("Admin"), classController.moveStudentToClass);
router.put("/:classId/students/:studentId", authenticate, roleMiddleware("Admin"), classController.deactivateStudentInClass);

router.delete("/:id", authenticate, roleMiddleware("Admin"), classController.deleteClass);

module.exports = router;
