const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const { authenticate } = require("../middleware/authMiddleware")

router.post("/", submissionController.createSubmission);
router.get("/:id", submissionController.getSubmissionById);
router.put("/:id", submissionController.updateSubmission);
router.delete("/:id", authenticate, submissionController.deleteSubmission);

module.exports = router;

// router.post("/:id/comments", authenticate, submissionController.addCommentToSubmission);
