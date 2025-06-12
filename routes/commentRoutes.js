const express = require("express");
const commentController = require("../controllers/commentController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// -------- Assignment --------
router.post("/assignment/:assignmentId/", authenticate, commentController.addCommentToAssignment);
router.get("/assignment/:assignmentId/", authenticate, commentController.getCommentsByAssignment);

// -------- Submission --------
router.post("/submission/:submissionId/", authenticate, commentController.addCommentToSubmission);
router.get("/submission/:submissionId/", authenticate, commentController.getCommentsBySubmission);

router.put("/:commentId", authenticate,  commentController.updateComment);
router.delete("/:commentId", authenticate,  commentController.deleteComment);

module.exports = router;
