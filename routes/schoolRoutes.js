const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/schoolController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

router.post("/", authenticate, roleMiddleware("Admin"), schoolController.createSchool);
router.put("/:id", authenticate, roleMiddleware("Admin"), schoolController.updateSchool);
router.get("/", authenticate, roleMiddleware("Admin"), schoolController.getAllSchools);
router.get("/:id", authenticate, roleMiddleware("Admin"), schoolController.getSchoolById);
router.delete("/:id", authenticate, roleMiddleware("Admin"), schoolController.deleteSchool);

module.exports = router;
