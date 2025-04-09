const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", authenticate, roleMiddleware("Student", "Admin"), upload.array("submissionFiles", 5), submissionController.createSubmission);
router.get("/", authenticate, submissionController.getAllSubmissions);
router.get("/:id", authenticate, submissionController.getSubmissionById);
router.post("/:id/submit", authenticate, roleMiddleware("Student"), submissionController.submitSubmission);
router.put("/:id", authenticate, roleMiddleware("Student", "Admin"), submissionController.updateSubmission);
router.delete("/:id", authenticate, roleMiddleware("Student", "Admin"), submissionController.deleteSubmission);


module.exports = router;

// router.post("/:id/comments", authenticate, submissionController.addCommentToSubmission);
