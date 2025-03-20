const fs = require("fs");
const path = require("path");

// ✅ Fungsi umum untuk membuat folder jika belum ada
const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// ✅ Fungsi umum untuk membuat folder berdasarkan path dinamis
const createDynamicFolder = (...segments) => {
    const folderPath = path.join("uploads", ...segments);
    createFolderIfNotExists(folderPath);
    console.log(`[INFO] Folder dibuat: ${folderPath}`);
};

// ✅ Fungsi spesifik untuk masing-masing entitas
const folderHelper = {
    createSchoolFolder: (schoolId) => 
        createDynamicFolder(`school-${schoolId}`),

    createClassFolder: (schoolId, classId) => 
        createDynamicFolder(`school-${schoolId}`, `class-${classId}`),

    createSubjectFolder: (schoolId, classId, subjectId) => 
        createDynamicFolder(`school-${schoolId}`, `class-${classId}`, `subject-${subjectId}`),

    createAssignmentFolder: (schoolId, classId, subjectId, assignmentId) =>
        createDynamicFolder(`school-${schoolId}`, `class-${classId}`, `subject-${subjectId}`, `assignments-${assignmentId}`),

    createSubmissionFolder: (schoolId, classId, subjectId, submissionId) =>
        createDynamicFolder(`school-${schoolId}`, `class-${classId}`, `subject-${subjectId}`, `submissions-${submissionId}`)
};

// ✅ Ekspor fungsi agar bisa dipakai di Service atau Controller
module.exports = folderHelper;
