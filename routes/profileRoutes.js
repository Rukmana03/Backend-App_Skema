const express = require("express");
const profileController = require("../controllers/profileController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticate, profileController.createProfile);
router.get("/", authenticate, roleMiddleware("Admin"), profileController.getAllProfiles);
router.get("/me", authenticate, profileController.getProfileById);
router.patch("/", authenticate, profileController.updateProfile);
router.delete("/", authenticate, profileController.deleteProfile);

module.exports = router;
