const express = require("express");
const commentController = require("../controllers/commentController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:assignmentId/comments", authenticate, commentController.addCommentToAssignment);
router.get("/:assignmentId/comments", authenticate, commentController.getCommentsByAssignment);
router.post("/:submissionId/comments", authenticate, commentController.addCommentToSubmission);
router.get("/:submissionId/comments", authenticate, commentController.getCommentsByAssignment);

module.exports = router;