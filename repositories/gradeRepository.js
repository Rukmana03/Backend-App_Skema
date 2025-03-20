const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const gradeRepository = {
    createGrade: async ({ submissionId, teacherId, score, feedback }) => {
        if (!submissionId) {
            throw new Error("submissionId is required.");
        }

        console.log("[DEBUG] submissionId:", submissionId);

        const submission = await prisma.submission.findUnique({
            where: { id: Number(submissionId) },
            include: { grades: true },
        });

        if (!submission) {
            throw new Error("Submission tidak ditemukan");
        }

        if (submission.grades.length > 0) {
            throw new Error("Submission sudah dinilai sebelumnya");
        }

        const newGrade = await prisma.grade.create({
            data: {
                submissionId: Number(submissionId),
                teacherId: Number(teacherId),
                score: Number(score),
                feedback,
                gradedDate: new Date(),
            },
        });

        return newGrade;
    },

    getGradeBySubmissionId: async (submissionId) => {
        return await prisma.grade.findFirst({
            where: { submissionId },
            include: {
                teacher: { select: { id: true, username: true } },
            },
        });
    },

    updateSubmissionStatus: async (submissionId, newStatus) => {
        console.log("[DEBUG] Mengupdate submissionId:", submissionId, "ke status:", newStatus);
        return await prisma.submission.update({
            where: { id: Number(submissionId) },
            data: { status: newStatus }
        });
    },

    updateGrade: async (gradeId, data) => {
        console.log("[DEBUG] Memperbarui gradeId:", gradeId, "dengan data:", data);
        return await prisma.grade.update({
            where: { id: Number(gradeId) },
            data
        });
    },

    getGradeById: async (gradeId) => {
        return await prisma.grade.findUnique({
            where: { id: gradeId },
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
