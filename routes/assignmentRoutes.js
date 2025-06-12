const express = require("express");
const assignmentController = require("../controllers/assignmentController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, roleMiddleware("Teacher"), assignmentController.createAssignment);
router.get("/", authenticate, roleMiddleware("Teacher", "Student"), assignmentController.getAllAssignments);
router.get("/:id", authenticate, roleMiddleware("Teacher", "Student"), assignmentController.getAssignmentById);
router.put("/:id", authenticate, roleMiddleware("Teacher"), assignmentController.updateAssignment);
router.delete("/:id", authenticate, roleMiddleware("Teacher"), assignmentController.deleteAssignment);

module.exports = router;

