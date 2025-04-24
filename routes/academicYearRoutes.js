const express = require('express');
const router = express.Router();
const academicYearController = require('../controllers/academicYearController');
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, academicYearController.createAcademicYear);
router.get("/", authenticate, academicYearController.getAllAcademicYears);
router.get("/active", authenticate, academicYearController.getActiveAcademicYear);
router.get("/inactive", authenticate, academicYearController.getInActiveAcademicYear);
router.get("/:id", authenticate, academicYearController.getAcademicYearById);
router.put("/:id", authenticate, academicYearController.updateAcademicYear);
router.delete("/:id", authenticate, academicYearController.deleteAcademicYear);

module.exports = router;