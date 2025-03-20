const express = require("express");
const profileController = require("../controllers/profileController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticate, profileController.createProfile);
router.get("/", authenticate, profileController.getProfile);
router.patch("/:id", authenticate, profileController.updateProfile);
router.delete("/:id", authenticate, profileController.deleteProfile);

module.exports = router;
