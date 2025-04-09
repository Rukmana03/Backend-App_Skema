const fs = require("fs");
const path = require("path");


// Fungsi untuk membuat folder jika belum ada
const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`[INFO] Folder dibuat: ${folderPath}`);
    }
};

// Fungsi untuk membuat folder berdasarkan path dinamis
const createDynamicFolder = (...segments) => {
    const folderPath = path.join("uploads", ...segments);
    createFolderIfNotExists(folderPath);
    return folderPath; // Mengembalikan path untuk digunakan di tempat lain
};

// Helper untuk membuat folder tertentu
const folderHelper = {
    createSchoolFolder: (schoolId) => createDynamicFolder(`school-${schoolId}`),

    createClassFolder: (schoolId, classId) =>
        createDynamicFolder(`school-${schoolId}`, `class-${classId}`),

    createSubjectFolder: (schoolId, classId, subjectId) =>
        createDynamicFolder(`school-${schoolId}`, `class-${classId}`, `subject-${subjectId}`),

    createAssignmentFolder: (schoolId, classId, subjectId, assignmentId) =>
        createDynamicFolder(`school-${schoolId}`, `class-${classId}`, `subject-${subjectId}`, `assignment-${assignmentId}`),

    createSubmissionFolder: (schoolId, classId, subjectId, assignmentId, submissionId) =>
        createDynamicFolder(`school-${schoolId}`, `class-${classId}`, `subject-${subjectId}`, `assignment-${assignmentId}`, `submission-${submissionId}`)
};

module.exports = folderHelper;
