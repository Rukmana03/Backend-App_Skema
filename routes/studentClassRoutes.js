const express = require("express");
const studentClassController = require("../controllers/studentClassController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, roleMiddleware("Admin"), studentClassController.addStudentToClass);
router.post("/promote", studentClassController.promoteStudentsToClass);
router.get("/:id/active", authenticate, roleMiddleware("Admin", "Teacher"), studentClassController.getActiveStudentsInClass);
router.put("/move", authenticate, roleMiddleware("Admin"), studentClassController.moveStudentToClass);
router.put("/:classId/students/:studentId", authenticate, roleMiddleware("Admin"), studentClassController.deactivateStudentInClass);

module.exports = router;