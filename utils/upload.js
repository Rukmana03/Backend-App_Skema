const multer = require("multer");
const path = require("path");
const folderHelper = require("../utils/folderHelper");
const assignmentRepository = require("../repositories/assignmentRepository");
const submissionRepository = require("../repositories/submissionRepository");

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const { assignmentId } = req.body;
            let uploadPath = folderHelper.getFileDataFolder();

            const isAssignment = file.fieldname === "assignmentFile"; 

            if (assignmentId) {
                const assignment = await assignmentRepository.getAssignmentById(Number(assignmentId));
                if (!assignment) return cb(new Error("Assignment not found"));

                const subjectClass = await submissionRepository.getSubjectClassByAssignmentId(Number(assignmentId));
                if (!subjectClass || !subjectClass.class) return cb(new Error("Subject or Class not found"));

                const schoolId = subjectClass.class.schoolId;
                const classId = subjectClass.class.id;
                const subjectId = subjectClass.subjectId;

                uploadPath = isAssignment
                    ? folderHelper.createAssignmentFolder(schoolId, classId, subjectId)
                    : folderHelper.createSubmissionFolder(schoolId, classId, subjectId);
            }

            folderHelper.createFolderIfNotExists(uploadPath);
            console.log("[DEBUG] Files will be stored on:", uploadPath);
            cb(null, uploadPath);
        } catch (err) {
            cb(err);
        }
    },

    filename: (req, file, cb) => {
        const prefix = req.body.assignmentId ? "submission_" : "assignment_";
        const timestamp = Date.now();
        const uniqueName = `${prefix}${timestamp}_${file.originalname}`;
        cb(null, uniqueName); 
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = [".pdf", ".doc", ".docx"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files, Doc, and Docx are allowed"), false);
        }
    }
});

module.exports = upload;
