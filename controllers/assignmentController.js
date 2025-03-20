const assignmentService = require("../services/assignmentService");
const { errorResponse, successResponse } = require("../utils/responeHandler")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const assignmentController = {
    createAssignment: async (req, res) => {
        try {
            const { subjectClassId, teacherId, title, description, deadline, assignmentType, taskCategory } = req.body;

            if (!subjectClassId || !teacherId) {
                return res.status(400).json({ error: "subjectClassId dan teacherId harus diisi." });
            }

            const newAssignment = await assignmentService.createAssignment({
                subjectClassId,
                teacherId,
                title,
                description,
                deadline,
                assignmentType,
                taskCategory
            });

            res.status(201).json(newAssignment);
        } catch (error) {
            res.status(500).json({ error: error.message || "Terjadi kesalahan saat membuat tugas." });
        }
    },

    getAllAssignments: async (req, res) => {
        try {
            const assignments = await assignmentService.getAllAssignments();

            if (assignments.length === 0) {
                return res.status(404).json({ message: "No assignments found" });
            }
            res.status(200).json({ message: "Assignments retrieved successfully", data: assignments });
        } catch (error) {
            console.error("Error in getAllAssignments:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    },

    getAssignmentById: async (req, res) => {
        try {
            const assignment = await assignmentService.getAssignmentById(req.params.id);
            if (!assignment) return res.status(404).json({ success: false, message: "Tugas tidak ditemukan" });

            res.status(200).json({ success: true, message: "Detail tugas berhasil diambil", data: assignment });
        } catch (error) {
            console.error("Error in getAssignmentById:", error);
            res.status(500).json({ success: false, message: "Terjadi kesalahan" });
        }
    },

    updateAssignment: async (req, res) => {
        try {
            const updatedAssignment = await assignmentService.updateAssignment(req.params.id, req.body);
            res.status(200).json({ success: true, message: "Tugas berhasil diperbarui", data: updatedAssignment });
        } catch (error) {
            console.error("Error in updateAssignment:", error);
            res.status(500).json({ success: false, message: "Terjadi kesalahan" });
        }
    },

    deleteAssignment: async (req, res) => {
        try {
            await assignmentService.deleteAssignment(req.params.id);
            res.status(200).json({ success: true, message: "Tugas berhasil dihapus" });
        } catch (error) {
            console.error("Error in deleteAssignment:", error);
            res.status(500).json({ success: false, message: "Terjadi kesalahan" });
        }
    },
};

module.exports = assignmentController;

// const addComment = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const comment = await assignmentService.addComment(req.params.id, userId, req.body.content);
//         res.status(201).json(comment);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
