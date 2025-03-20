const express = require("express");
const fileStorageController = require("../controllers/fileStorageController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/assignment/:assignmentId", authenticate, roleMiddleware("Teacher", "Admin"), fileStorageController.addFileToAssignment);
router.post("/submission/:submissionId", authenticate, roleMiddleware("Student"), fileStorageController.addFileToSubmission);
router.get("/assignment/:assignmentId", authenticate, fileStorageController.getFilesByAssignment);
router.get("/submission/:submissionId", authenticate, fileStorageController.getFilesBySubmission);
router.delete("/:fileId", authenticate, fileStorageController.deleteFile);

module.exports = router;
