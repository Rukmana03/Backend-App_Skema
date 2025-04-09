const express = require("express");
const fileStorageController = require("../controllers/fileStorageController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/assignment/:assignmentId/", authenticate, upload.array("assignmentFiles", 5), fileStorageController.addFileToAssignment);
router.get("/assignment/:assignmentId", authenticate, fileStorageController.getFilesByAssignment);
router.get("/submission/:submissionId", authenticate, fileStorageController.getFilesBySubmission);
router.delete("/:fileId", authenticate, fileStorageController.deleteFile);
router.get("/download/:fileId", authenticate, fileStorageController.downloadFile);

module.exports = router;
