const express = require("express");
const fileStorageController = require("../controllers/fileStorageController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/upload-files/", authenticate, upload.array("files", 5), fileStorageController.addFileToAssignment);
router.get("/assignment/:assignmentId", authenticate, fileStorageController.getFilesByAssignment);
router.get("/submission/:submissionId", authenticate, fileStorageController.getFilesBySubmission);
router.delete("/:fileId", authenticate, fileStorageController.deleteFile);
router.get("/download/:fileId", authenticate, fileStorageController.downloadFile);

module.exports = router;
