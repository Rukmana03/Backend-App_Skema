const express = require("express");
const subjectController = require("../controllers/subjectController");
const { authenticate, roleMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", authenticate, roleMiddleware(["Admin"]), subjectController.createSubject);
router.get("/", subjectController.getAllSubjects);
router.get("/:id", subjectController.getSubjectById);
router.put("/:id", authenticate, roleMiddleware(["Admin"]), subjectController.updateSubject);
router.delete("/:id", authenticate, roleMiddleware(["Admin"]), subjectController.deleteSubject);
router.post("/:id/teachers", authenticate, roleMiddleware(["Admin"]), subjectController.addTeacherToSubject);
router.get("/:id/teachers", authenticate, roleMiddleware(["Admin"]), subjectController.getTeachersBySubject);


module.exports = router;
