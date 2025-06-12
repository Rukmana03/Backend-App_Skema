const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");
const validateDeadline = require("../middleware/validateDeadline");

router.post("/", authenticate, roleMiddleware("Student"), upload.array("files", 5), validateDeadline, submissionController.createSubmission);
router.get("/", authenticate, roleMiddleware("Student", "Teacher"),submissionController.getAllSubmissions);
router.get("/:id", authenticate, roleMiddleware("Student", "Teacher"), submissionController.getSubmissionById);
router.put("/:id", authenticate, roleMiddleware("Student"), submissionController.updateSubmission);
router.delete("/:id", authenticate, roleMiddleware("Student"), submissionController.deleteSubmission);

module.exports = router;
