const express = require("express");
const authController = require("../controllers/authController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/logout", authenticate, authController.logoutUser);
router.post("/refresh-token", authenticate, roleMiddleware("Admin"), authController.refreshToken);

module.exports = router;
