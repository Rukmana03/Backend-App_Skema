const subjectRepository = require("../repositories/subjectRepository");
const userService = require("../services/userService");
const userRepository = require("../repositories/userRepository")
const { throwError, successResponse, } = require("../utils/responeHandler");

const subjectService = {
    createSubject: async (subjectName, description, teacherId) => {
        if (!subjectName || !description) {
            throwError(400, "Name and description are required");
        }

        const existingSubject = await subjectRepository.getSubjectByName(subjectName);
        if (existingSubject) {
            throwError(400, "Subject with this name already exists");
        }

        let validatedTeacherId = null;
        if (teacherId) {
            const teacher = await userService.getUserById(teacherId);
            console.log("Teacher Data:", teacher);

            if (!teacher || teacher.role.toLowerCase() !== "Teacher") {
                throwError(400, "Invalid teacher ID. User is not a teacher.");
            }
            validatedTeacherId = Number(teacherId);
        }
        // Buat subject dengan atau tanpa teacherId
        return await subjectRepository.createSubject(subjectName, description, validatedTeacherId);
    },

    getAllSubjects: async () => {
        const subjects = await subjectRepository.findAllSubjects();
        return subjects;
    },

    getSubjectById: async (id) => {
        return await subjectRepository.findSubjectById(id);
    },

    updateSubject: async (id, subjectName, description) => {
        console.log("Before Parsing:", { id });

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
