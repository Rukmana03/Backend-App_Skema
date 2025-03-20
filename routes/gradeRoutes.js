const express = require("express");
const gradeController = require("../controllers/gradeController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticate, roleMiddleware("Teacher", "Admin"), gradeController.createGrade);
router.get("/:submissionId", authenticate, gradeController.getGradeBySubmissionId);
router.get("/class/:classId", authenticate, roleMiddleware("Teacher", "Admin"), gradeController.getGradesByClassId);
router.get("/student/:studentId", authenticate, roleMiddleware("Teacher", "Admin"), gradeController.getGradesByStudentId);
router.get("/assignment/:assignmentId", authenticate, roleMiddleware("Teacher", "Admin"), gradeController.getGradesByAssignmentId);
router.get("/me", authenticate, roleMiddleware("Student", "Admin"), gradeController.getMyGrades);
router.patch("/:id", authenticate, roleMiddleware("Teacher", "Admin"), gradeController.updateGrade);
router.delete("/:id", authenticate, roleMiddleware("Teacher", "Admin"), gradeController.deleteGrade);


module.exports = router;
