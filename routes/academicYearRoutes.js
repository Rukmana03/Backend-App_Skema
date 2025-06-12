const express = require('express');
const router = express.Router();
const academicYearController = require('../controllers/academicYearController');
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

router.post("/", authenticate, roleMiddleware("Admin"),academicYearController.createAcademicYear);
router.get("/", authenticate, roleMiddleware("Admin", "Teacher"), academicYearController.getAllAcademicYears);
router.get("/active", authenticate, roleMiddleware("Admin", "Teacher"), academicYearController.getActiveAcademicYear);
router.get("/inactive", authenticate, roleMiddleware("Admin", "Teacher"), academicYearController.getInActiveAcademicYear);
router.get("/:id", authenticate, roleMiddleware("Admin", "Teacher"), academicYearController.getAcademicYearById);
router.put("/:id", authenticate, roleMiddleware("Admin"), academicYearController.updateAcademicYear);
router.delete("/:id", authenticate, roleMiddleware("Admin"), academicYearController.deleteAcademicYear);

module.exports = router;