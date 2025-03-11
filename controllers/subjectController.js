const subjectRepository = require("../repositories/subjectRepository");
const { throwError, errorResponse, successResponse } = require("../utils/responeHandler");
const subjectService = require("../services/subjectService");

const subjectController = {
    createSubject: async (req, res) => {
        try {
            const { subjectName, description, teacherId } = req.body;

            const subject = await subjectService.createSubject(subjectName, description, teacherId);

            res.status(201).json({
                message: "Subject created successfully",
                data: {
                    id: subject.id,
                    subjectName: subject.subjectName,
                    description: subject.description,
                    teacher: subject.users
                        ? {
                            id: subject.users.id,
                            name: subject.users.username,
                            email: subject.users.email,
                        }
                        : null,
                },
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    },

    getAllSubjects: async (req, res) => {
        try {

            const subjects = await subjectService.getAllSubjects();

            if (subjects.length === 0) {
                return res.status(404).json({ message: "No subjects found" });
            }
            res.json(subjects);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getSubjectById: async (req, res) => {
        try {
            const { id } = req.params;
            console.log("Controller received ID:", id); // Debugging

            const subject = await subjectRepository.findSubjectById(id);

            if (!subject) {
                return res.status(404).json({ message: "Subject not found" });
            }

            res.json(subject);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateSubject: async (req, res) => {
        try {
            const { id } = req.params;
            const { subjectName, description } = req.body;

            console.log("Received Data:", { id, subjectName, description });

            const updatedSubject = await subjectService.updateSubject(id, subjectName, description);

            res.status(200).json({
                message: "Subject updated successfully",
                data: updatedSubject,
            });
        } catch (error) {
            console.error("Update Subject Error:", error);
            res.status(400).json({ error: error.message });
        }
    },

    deleteSubject: async (req, res) => {
        try {
            const { id } = req.params;
            await subjectService.deleteSubject(id);
            res.status(200).json({ message: "Subject deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addTeacherToSubject: async (req, res) => {
        try {
            const { id: subjectId } = req.params;
            const { teacherId } = req.body;

            console.log("Received Data:", { subjectId, teacherId });

            const subject = await subjectService.addTeacherToSubject(subjectId, teacherId);

            res.status(200).json({
                message: "Teacher added to subject successfully",
                data: subject,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getTeachersBySubject: async (req, res) => {
        try {
            const { id: subjectId } = req.params;
            const teachers = await subjectService.getTeachersBySubject(subjectId);

            return successResponse(res, 200, "Teachers found", teachers);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message);
        }
    },
};


module.exports = subjectController;
