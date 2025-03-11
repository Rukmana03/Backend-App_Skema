const express = require("express");
const assignmentController = require("../controllers/assignmentController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, roleMiddleware("Teacher", "Admin"), assignmentController.createAssignment);
router.get("/", authenticate, assignmentController.getAllAssignments);
router.get("/:id", authenticate, assignmentController.getAssignmentById);
router.put("/:id", authenticate, roleMiddleware("Teacher", "Admin"), assignmentController.updateAssignment);
router.delete("/:id", authenticate, roleMiddleware("Teacher", "Admin"), assignmentController.deleteAssignment);

module.exports = router;

// router.post("/:id/comments", authenticate, roleMiddleware("Teacher"), assignmentController.addComment);
