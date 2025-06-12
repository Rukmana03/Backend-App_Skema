const express = require("express");
const classController = require("../controllers/classController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, roleMiddleware("Admin", "Teacher"), classController.getAllClasses);
router.get("/:id", authenticate, roleMiddleware("Admin", "Teacher"), classController.getClassById);
router.get("/:id/subjects", authenticate, roleMiddleware("Admin", "Teacher"), classController.getSubjectsByClassId);
router.get("/:id/members", authenticate, roleMiddleware("Admin", "Teacher"), classController.getClassMembers);

router.post("/", authenticate, roleMiddleware("Admin"), classController.createClass);
router.put("/:id", authenticate, roleMiddleware("Admin"), classController.updateClass);
router.delete("/:id", authenticate, roleMiddleware("Admin"), classController.deleteClass);

module.exports = router;
