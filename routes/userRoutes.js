const express = require("express");
const userController = require("../controllers/userController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, roleMiddleware("Admin"), userController.createUser);
router.get("/", authenticate, roleMiddleware("Admin"), userController.getAllUsers);
router.get("/:id", authenticate, roleMiddleware("Admin"), userController.getUserById);
router.put("/:id", authenticate, roleMiddleware("Admin"), userController.updateUser);
router.delete("/:id", authenticate, roleMiddleware("Admin"), userController.deleteUser);
router.get("/role/:role", authenticate, roleMiddleware("Admin"), userController.getUsersByRole);

module.exports = router;
