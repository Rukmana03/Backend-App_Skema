const express = require("express");
const commentController = require("../controllers/commentController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// -------- Assignment --------
router.post("/assignment/:assignmentId/comments", authenticate, roleMiddleware("Teacher", "Admin"), commentController.addCommentToAssignment);
router.get("/assignment/:assignmentId/comments", authenticate, commentController.getCommentsByAssignment);

// -------- Submission --------
router.post("/submission/:submissionId/comments", authenticate, commentController.addCommentToSubmission);
router.get("/submission/:submissionId/comments", authenticate, commentController.getCommentsBySubmission);

module.exports = router;
