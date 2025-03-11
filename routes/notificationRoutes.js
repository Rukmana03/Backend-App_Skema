const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, notificationController.sendNotification);
router.get("/", authenticate, notificationController.getUserNotifications);
router.patch("/:id", authenticate, notificationController.markNotificationAsRead);
router.delete("/:id", authenticate, notificationController.deleteNotification);

module.exports = router;
