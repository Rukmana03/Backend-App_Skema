const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateRegister } = require("../middleware/authMiddleware");

router.post("/register", validateRegister, authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
