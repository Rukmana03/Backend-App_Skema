const express = require("express");
const gradeController = require("../controllers/gradeController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware"); // Middleware untuk autentikasi
const router = express.Router();

// Hanya Teacher yang bisa memberikan nilai
router.post("/", authenticate, roleMiddleware("Teacher"), gradeController.createGrade);

// Student dan Teacher bisa melihat nilai submission
router.get("/:submissionId", authenticate, gradeController.getGradeBySubmissionId);

// Hanya Teacher yang bisa mengedit nilai
router.patch("/:id", authenticate, roleMiddleware(["Teacher"]), gradeController.updateGrade);

// Hanya Teacher yang bisa menghapus nilai
router.delete("/:id", authenticate, roleMiddleware(["Teacher"]), gradeController.deleteGrade);

// Get all grades in a class (Teacher Only)
router.get("/class/:classId", authenticate, roleMiddleware(["Teacher"]), gradeController.getGradesByClassId);

// Get all grades of a student (Teacher or Admin)
router.get("/student/:studentId", authenticate, roleMiddleware(["Teacher", "Admin"]), gradeController.getGradesByStudentId);

// Get all grades for an assignment (Teacher Only)
router.get("/assignment/:assignmentId", authenticate, roleMiddleware(["Teacher"]), gradeController.getGradesByAssignmentId);

// Get logged-in student's grades
router.get("/me", authenticate, roleMiddleware(["Student"]), gradeController.getMyGrades);

module.exports = router;
