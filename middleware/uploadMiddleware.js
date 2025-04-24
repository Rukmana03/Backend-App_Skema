const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Fungsi untuk memastikan folder tersedia sebelum penyimpanan
const createFolderIfNotExists = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

// ✅ Konfigurasi Penyimpanan File Dinamis
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "uploads/";
        const { schoolId, classId, assignmentId, submissionId } = req.body;

        if (!schoolId || !classId) {
            return cb(new Error("School ID dan Class ID wajib disertakan"), null);
        }

        folder += `school-${schoolId}/class-${classId}/`;

        if (req.baseUrl.includes("/assignment/")) {
            if (!assignmentId) {
                return cb(new Error("Assignment ID wajib disertakan"), null);
            }
            folder += `assignments/${assignmentId}/`;
        } else if (req.baseUrl.includes("/submission/")) {
            if (!submissionId) {
                return cb(new Error("Submission ID wajib disertakan"), null);
            }
            folder += `submissions/${submissionId}/`;
        }

        createFolderIfNotExists(folder);
        console.log(`[DEBUG] File akan disimpan di: ${folder}`);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// ✅ Filter hanya menerima PDF, DOC, DOCX
const fileFilter = (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        console.error(`[ERROR] Format file tidak diizinkan: ${file.originalname}`);
        cb(new Error("Hanya file PDF, DOC, dan DOCX yang diperbolehkan"), false);
    }
};

// ✅ Middleware Multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
