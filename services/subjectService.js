const subjectRepository = require("../repositories/subjectRepository");
const { throwError } = require("../utils/responseHandler");

const subjectService = {
    createSubject: async (subjectName, description) => {
        if (!subjectName || !description) {
            throwError(400, "Subject name and description are required.");
        }

        const existing = await subjectRepository.getSubjectByName(subjectName);
        if (existing) {
            throwError(400, "Subject with this name already exists.");
        }

        return await subjectRepository.createSubject(subjectName, description);
    },

    getAllSubjects: async () => {
        const subjects = await subjectRepository.getAllSubjects();
        if (!subjects.length) { 
            throwError(400, "No subjects found");
        }

        return subjects.map((sj) => ({
            id: sj.id,
            subjectName: sj.subjectName,
            subjectClasses: sj.subjectClasses
        }));
        
    },

    getSubjectById: async (id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) throwError(400, "Invalid subject ID.");

        const subject = await subjectRepository.getSubjectById(parsedId);
        if (!subject) throwError(404, "Subject not found.");

        return {
            id: subject.id,
            subjectName: subject.subjectName,
            description: subject.description,
            subjectClasses: subject.subjectClasses,
        };
    },

    updateSubject: async (id, subjectName, description) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) throwError(400, "Invalid subject ID.");

        const existingSubject = await subjectRepository.getSubjectById(parsedId);
        if (!existingSubject) throwError(404, "Subject not found.");

        if (subjectName && subjectName !== existingSubject.subjectName) {
            const duplicate = await subjectRepository.getSubjectByName(subjectName);
            if (duplicate && duplicate.id !== parsedId) {
                throwError(400, "Subject name already exists.");
            }
        }

        return await subjectRepository.updateSubject(parsedId, {
            subjectName: subjectName || existingSubject.subjectName,
            description: description || existingSubject.description,
            updatedAt: new Date()
        });
    },

    deleteSubject: async (id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) throwError(400, "Invalid subject ID.");

        const subjectExists = await subjectRepository.getSubjectById(parsedId);
        if (!subjectExists) throwError(404, "Subject not found.");

        return await subjectRepository.deleteSubject(parsedId);
    },

};

module.exports = subjectService;
