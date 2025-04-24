const express = require("express");
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/logout", authenticate, authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.put("/change-password", authenticate, authController.changePassword);


module.exports = router;
