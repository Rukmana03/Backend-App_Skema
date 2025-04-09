const subjectRepository = require("../repositories/subjectRepository");
const userService = require("../services/userService");
const userRepository = require("../repositories/userRepository");
const folderHelper = require("../utils/folderHelper");
const { throwError } = require("../utils/responseHandler");

const subjectService = {
    createSubject: async (subjectName, description, classId, teacherId) => {
        if (!subjectName || !description || !classId || !teacherId) {
            throwError(400, "Name, description, classId, and teacherId are required.");
        }

        const parsedClassId = Number(classId);
        const parsedTeacherId = Number(teacherId);
        if (isNaN(parsedClassId) || isNaN(parsedTeacherId)) {
            throwError(400, "classId and teacherId must be numbers.");
        }

        const existingSubject = await subjectRepository.getSubjectByName(subjectName);
        if (existingSubject) {
            throwError(400, "Subject with this name already exists.");
        }

        const classData = await subjectRepository.findClassById(parsedClassId);
        if (!classData) {
            throwError(404, "Class not found.");
        }

        const teacher = await userService.getUserById(parsedTeacherId);
        if (!teacher || teacher.role !== "Teacher") {
            throwError(400, "Invalid teacher ID. User is not a teacher.");
        }

        const newSubject = await subjectRepository.createSubject(subjectName, description);
        const code = `SUB-${newSubject.id}-${parsedClassId}-${parsedTeacherId}`;

        const newSubjectClass = await subjectRepository.createSubjectClass(
            newSubject.id, parsedClassId, parsedTeacherId, code
        );

        folderHelper.createSubjectFolder(classData.schoolId, parsedClassId, newSubjectClass.id);

        return { newSubject, newSubjectClass };
    },

    getAllSubjects: async () => {
        return await subjectRepository.findAllSubjects();
    },

    getSubjectById: async (id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) throwError(400, "Invalid subject ID.");

        const subject = await subjectRepository.findSubjectById(parsedId);
        if (!subject) throwError(404, "Subject not found.");

        return subject;
    },

    updateSubject: async (id, subjectName, description) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) throwError(400, "Invalid subject ID.");

        const subjectExists = await subjectRepository.findSubjectById(parsedId);
        if (!subjectExists) throwError(404, "Subject not found.");

        return await subjectRepository.updateSubject(parsedId, {
            subjectName: subjectName || subjectExists.subjectName,
            description: description || subjectExists.description,
            updatedAt: new Date()
        });
    },

    deleteSubject: async (id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) throwError(400, "Invalid subject ID.");

        const subjectExists = await subjectRepository.findSubjectById(parsedId);
        if (!subjectExists) throwError(404, "Subject not found.");

        return await subjectRepository.deleteSubject(parsedId);
    },

    addTeacherToSubject: async (subjectId, teacherId) => {
        const parsedSubjectId = Number(subjectId);
        const parsedTeacherId = Number(teacherId);

        if (isNaN(parsedSubjectId) || isNaN(parsedTeacherId)) {
            throwError(400, "Invalid subject ID or teacher ID");
        }

        const subject = await subjectRepository.findSubjectById(parsedSubjectId);
        if (!subject) throwError(404, "Subject not found");

        const user = await userRepository.findUserById(parsedTeacherId);
        if (!user) throwError(404, "User not found");
        if (user.role !== "Teacher") throwError(400, "Only teachers can be assigned to subjects");

        return await subjectRepository.createSubjectClass(parsedSubjectId, null, parsedTeacherId, `SUB-${parsedSubjectId}-${teacherId}`);
    },

    getTeachersBySubject: async (subjectId) => {
        const parsedSubjectId = Number(subjectId);
        if (isNaN(parsedSubjectId)) throwError(400, "Invalid subject ID.");

        const subject = await subjectRepository.getTeachersBySubjectId(parsedSubjectId);
        if (!subject) throwError(404, "Subject not found");

        return subject.users ? [subject.users] : [];
    },
};

module.exports = subjectService;
