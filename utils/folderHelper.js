const fs = require("fs");
const path = require("path");

const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`[INFO] Folders are made: ${folderPath}`);
    }
};

const getFileDataFolder = () => {
    const folderPath = path.join("Uploads", "File Data");
    createFolderIfNotExists(folderPath);
    return folderPath;
};

const createDynamicFolder = (...segments) => {
    const folderPath = path.join("Uploads", "File Data", ...segments);
    createFolderIfNotExists(folderPath);
    return folderPath;
};

const folderHelper = {
    getFileDataFolder,

    createSchoolFolder: (schoolId) => {
        return createDynamicFolder(
            `school-${schoolId}`,
        );
    },

    createClassFolder: (schoolId, classId) => {
        return createDynamicFolder(
            `school-${schoolId}`,
            `class-${classId}`,
        );
    },

    createSubjectFolder: (schoolId, classId, subjectId) => {
        return createDynamicFolder(
            `school-${schoolId}`,
            `class-${classId}`,
            `subject-${subjectId}`,
        );
    },

    createAssignmentFolder: (schoolId, classId, subjectId) => {
        return createDynamicFolder(
            `school-${schoolId}`,
            `class-${classId}`,
            `subject-${subjectId}`,
            "assignment"
        );
    },

    createSubmissionFolder: (schoolId, classId, subjectId) => {
        return createDynamicFolder(
            `school-${schoolId}`,
            `class-${classId}`,
            `subject-${subjectId}`,
            "submission"
        );
    },

    createDynamicFolderType: (type, schoolId, classId, subjectId) => {
        const parts = [
            `school-${schoolId}`,
            `class-${classId}`,
            `subject-${subjectId}`,
            type === "assignment" ? "assignment" : "submission"
        ];
        return createDynamicFolder(...parts);
    },
    createFolderIfNotExists,
};

module.exports = folderHelper;
