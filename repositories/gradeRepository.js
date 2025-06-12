const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const gradeRepository = {
    createGrade: async (data) => {
        return await prisma.grade.create({
            data: {
                ...data,
                gradedDate: new Date(),
            },
        });
    },

    getSubmissionWithAssignmentAndGrades: async (submissionId) => {
        return await prisma.submission.findUnique({
            where: { id: Number(submissionId) },
            include: { assignment: true, grades: true },
        });
    },

    updateSubmissionStatus: async (submissionId, newStatus) => {
        return await prisma.submission.update({
            where: { id: Number(submissionId) },
            data: { status: newStatus },
            select: { id: true, status: true },
        });
    },

    getGradeBySubmissionId: async (submissionId) => {
        console.log("Debug submissionId in getGradeBySubmissionId:", submissionId);
        return await prisma.grade.findFirst({
            where: { submissionId: Number(submissionId) },
            include: {
                teacher: { select: { id: true, username: true } },
            },
        });
    },

    updateGrade: async (gradeId, data) => {
        return await prisma.grade.update({
            where: { id: Number(gradeId) },
            data,
            include: { teacher: { select: { id: true, username: true } } },
        });
    },

    getGradeById: async (gradeId) => {
        return await prisma.grade.findUnique({
            where: { id: Number(gradeId) },
        });
    },

    deleteGrade: async (gradeId) => {
        return await prisma.grade.delete({
            where: { id: Number(gradeId) },
        });
    },

    getGradesByClassId: async (classId) => {
        return await prisma.grade.findMany({
            where: {
                submission: { assignment: { subjectClass: { classId: classId } } }
            },
            include: {
                submission: {
                    include: {
                        student: { select: { id: true, username: true } },
                        assignment: { select: { title: true, assignmentType: true } }
                    }
                },
                teacher: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            },
        });
    },

    getGradesByStudentId: async (studentId) => {
        return await prisma.grade.findMany({
            where: {
                submission: { studentId: Number(studentId) },
            },
            include: {
                submission: { include: { assignment: { select: { id: true, title: true } } } },
                teacher: { select: { id: true, username: true } },
            },
        });
    },

    getGradesByAssignmentId: async (assignmentId) => {
        return await prisma.grade.findMany({
            where: {
                submission: { assignmentId: Number(assignmentId) },
            },
            include: {
                submission: { include: { student: { select: { id: true, username: true } } } },
                teacher: { select: { id: true, username: true } },
            },
        });
    },
};

module.exports = gradeRepository;
