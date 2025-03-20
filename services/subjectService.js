const subjectRepository = require("../repositories/subjectRepository");
const userService = require("../services/userService");
const userRepository = require("../repositories/userRepository")
const { throwError } = require("../utils/responeHandler");
const folderHelper = require("../utils/folderHelper");

const subjectService = {
    createSubject: async (subjectName, description, classId, teacherId) => {
        if (!subjectName || !description || !classId || !teacherId) {
            throwError(400, "Name, description, classId, and teacherId are required.");
        }
        const existingSubject = await subjectRepository.getSubjectByName(subjectName);
        if (existingSubject) {
            throwError(400, "Subject with this name already exists.");
        }
        const teacher = await userService.getUserById(Number(teacherId));
        console.log("[DEBUG] Data Teacher:", teacher);
        if (!teacher || teacher.role !== "Teacher") {
            throwError(400, "Invalid teacher ID. User is not a teacher.");
        }
        const { newSubject, newSubjectClass, schoolId } = await subjectRepository.createSubject(
            subjectName, description, classId, teacherId
        );
        if (!schoolId) {
            throwError(500, "Failed to retrieve schoolId. Class might be invalid.");
        }
        folderHelper.createSubjectFolder(schoolId, newSubjectClass.classId, newSubjectClass.id);
        return { newSubject, newSubjectClass };
    },

    getAllSubjects: async () => {
        const subjects = await subjectRepository.findAllSubjects();
        return subjects;
    },

    getSubjectById: async (id) => {
        return await subjectRepository.findSubjectById(id);
    },

    updateSubject: async (id, subjectName, description) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
            throw new Error("Invalid subject ID");
        }

        console.log("Updating Subject:", { parsedId, subjectName, description });

        return await subjectRepository.updateSubject(parsedId, subjectName, description);
    },

    deleteSubject: async (id) => {
        return await subjectRepository.deleteSubject(id);
    },

    addTeacherToSubject: async (subjectId, teacherId) => {
        const subject = await subjectRepository.getTeachersBySubjectId(subjectId);

        if (!subject) {
            throwError(404, "Subject not found");
        }

        const user = await userRepository.findUserById(teacherId);

        if (!user) {
            throwError(404, "User not found");
        }

        if (user.role !== "Teacher") {
            throwError(400, "Only teachers can be assigned to subjects");
        }

        return await subjectRepository.addTeacherToSubject(subjectId, teacherId);
    },

    getTeachersBySubject: async (subjectId) => {
        const subject = await subjectRepository.getTeachersBySubjectId(subjectId);

        if (!subject) {
            throwError(404, "Subject not found");
        }

        return subject.users ? [subject.users] : null;
    },
};

module.exports = subjectService;
