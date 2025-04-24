const fs = require("fs");
const path = require("path");

const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`[INFO] Folder dibuat: ${folderPath}`);
    }
};

const createDynamicFolder = (...segments) => {
    const folderPath = path.join("uploads","File Data", ...segments);
    createFolderIfNotExists(folderPath);
    return folderPath; 
};

const folderHelper = {
    createSchoolFolder: () => createDynamicFolder(),
    createDynamicFolderType: (type, schoolId, classId, subjectId, assignmentId, submissionId = null ) => {
        const parts = [
            `school-${schoolId}`,
            `class-${classId}`,
            `subject-${subjectId}`,
            `assignment-${assignmentId}`
        ];
        if (type === "submission" && submissionId) {
            parts.push(`submission-${submissionId}`);
        }
        return createDynamicFolder(...parts);
    }
};

module.exports = folderHelper;
 