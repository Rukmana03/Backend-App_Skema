const express = require("express");
const subjectClassController = require("../controllers/subjectClassController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, roleMiddleware("Admin"), subjectClassController.createSubjectClass);
router.get("/", authenticate, roleMiddleware("Admin"), subjectClassController.getAllSubjectClasses);
router.get("/:classId", authenticate, roleMiddleware("Admin"), subjectClassController.getSubjectClassesByClass);
router.get("/teacher/:teacherId", authenticate, subjectClassController.getSubjectClassesByTeacher);
router.put("/:id", authenticate, roleMiddleware("Admin"), subjectClassController.updateSubjectClass);
router.delete("/:id", authenticate, roleMiddleware("Admin"), subjectClassController.deleteSubjectClass);

module.exports = router;
