const express = require("express");
const subjectController = require("../controllers/subjectController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, roleMiddleware("Admin"), subjectController.createSubject);
router.get("/", authenticate, roleMiddleware("Admin"), subjectController.getAllSubjects);
router.get("/:id", authenticate, roleMiddleware("Admin"), subjectController.getSubjectById);
router.put("/:id", authenticate, roleMiddleware("Admin"), subjectController.updateSubject);
router.delete("/:id", authenticate, roleMiddleware("Admin"), subjectController.deleteSubject);

module.exports = router;
