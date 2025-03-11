const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const assignmentRepository = {
    validAssignmentTypes: ["Daily", "Weekly"],
    validTaskCategories: ["Essay", "MultipleChoice", "Project"],

    // Cek apakah class, subject, dan teacher ada di database
    validateAssignmentData: async ({ subjectId, classId, teacherId }) => {
        const classExists = await prisma.class.findUnique({ where: { id: classId } });
        if (!classExists) {
            throw new Error("Class not found");
        }

        const subjectExists = await prisma.subject.findUnique({ where: { id: subjectId } });
        if (!subjectExists) {
            throw new Error("Subject not found");
        }

        const teacherExists = await prisma.user.findUnique({ where: { id: teacherId, role: "Teacher" } });
        if (!teacherExists) {
            throw new Error("Teacher not found");
        }
    },
    
    createAssignment: async (data) => {
        await assignmentRepository.validateAssignmentData(data);

        return await prisma.assignment.create({ data });
    },

    getAllAssignments: async () => {
        return await prisma.assignment.findMany();
    },

    getAssignmentById: async (id) => {
        return await prisma.assignment.findUnique({ where: { id: Number(id) } });
    },

    updateAssignment: async (id, data) => {
        return await prisma.assignment.update({
            where: { id: Number(id) },
            data,
        });
    },

    deleteAssignment: async (id) => {
        return await prisma.assignment.delete({ where: { id: Number(id) } });
    },

    addComment: async (assignmentId, userId, content) => {
        return await prisma.comment.create({
            data: {
                assignmentId: Number(assignmentId),
                userId: Number(userId),
                content,
                commentDate: new Date(),
            },
        });
    },

    createComment: async (assignmentId, submissionId, userId, text) => {
        return await prisma.comment.create({
            data: {
                assignmentId,
                submissionId,
                userId,
                text,
            },
        });
    },

    getStudentsByAssignmentId: async (assignmentId) => {
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            select: { classId: true },
        });

        if (!assignment) {
            return [];
        }

        return await prisma.studentClass.findMany({
            where: { classId: assignment.classId },
            select: { studentId: true },
        });
    },
};


module.exports = assignmentRepository;
