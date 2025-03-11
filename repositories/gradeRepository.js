const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const gradeRepository = {
    createGrade: async (data) => {
        return await prisma.grade.create({ data });
    },

    getGradeBySubmissionId: async (submissionId) => {
        return await prisma.grade.findFirst({
            where: { submissionId },
            include: {
                teacher: { select: { id: true, username: true } },
            },
        });
    },

    updateGrade: async (gradeId, data) => {
        return await prisma.grade.update({
            where: { id: gradeId },
            data,
        });
    },

    deleteGrade: async (gradeId) => {
        return await prisma.grade.delete({
            where: { id: gradeId },
        });
    },

    getGradesByClassId: async (classId) => {
        return await prisma.grade.findMany({
            where: {
                submission: {
                    assignment: { classId },
                },
            },
            include: {
                submission: {
                    include: { student: { select: { id: true, username: true } } },
                },
                teacher: { select: { id: true, username: true } },
            },
        });
    },

    getGradesByStudentId: async (studentId) => {
        return await prisma.grade.findMany({
            where: {
                submission: { studentId },
            },
            include: {
                submission: { include: { assignment: true } },
                teacher: { select: { id: true, username: true } },
            },
        });
    },

    getGradesByAssignmentId: async (assignmentId) => {
        return await prisma.grade.findMany({
            where: {
                submission: { assignmentId },
            },
            include: {
                submission: { include: { student: { select: { id: true, username: true } } } },
                teacher: { select: { id: true, username: true } },
            },
        });
    },
};

module.exports = gradeRepository;
