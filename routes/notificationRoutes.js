const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, notificationController.sendNotification);
router.get("/", authenticate, notificationController.getUserNotifications);
router.get("/:id", authenticate, notificationController.getNotificationById);
router.delete("/:id", authenticate, notificationController.deleteNotification);

module.exports = router;
