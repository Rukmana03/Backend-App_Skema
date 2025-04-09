const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const submissionRepository = {
    createSubmission: async (data) => {
        return prisma.submission.create({
            data: {
                assignmentId: data.assignmentId,
                studentId: data.studentId,
                submissionDate: new Date(),
                status: "Submitted"
            },
        });
    },

    getSubjectClassByAssignmentId: async (assignmentId) => {
        return prisma.subjectClass.findFirst({
            where: { assignments: { some: { id: assignmentId } } },
            include: { class: { select: { id: true, schoolId: true } } },
        });
    },

    getAllSubmissions: async () => {
        return prisma.submission.findMany({
            select: {
                id: true,
                submissionDate: true,
                status: true,
                student: { select: { id: true, username: true } },
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        teacher: { select: { id: true, username: true, email: true } }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        commentDate: true,
                        user: { select: { id: true, username: true, email: true } }
                    },
                    orderBy: { commentDate: "asc" }
                },
                files: {
                    select: {
                        file: {
                            select: {
                                id: true,
                                fileName: true,
                                fileUrl: true
                            }
                        }
                    }
                }
            }
        });
    },

    getSubmissionById: async (id) => {
        return prisma.submission.findUnique({
            where: { id },
            include: {
                assignment: { select: { id: true, title: true, teacherId: true, deadline: true } },
                student: { select: { id: true, username: true } }
            }
        });
    },

    findSubmissionByStudent: async (submissionId, studentId) => {
        return prisma.submission.findFirst({
            where: {
                id: submissionId,
                studentId: studentId
            }
        });
    },

    updateSubmission: async (id, data) => {
        return prisma.submission.update({
            where: { id },
            data,
        });
    },

    updateSubmissionStatus: async (submissionId, newStatus) => {
        return prisma.submission.update({
            where: { id: submissionId },
            data: { status: newStatus }
        });
    },

    deleteSubmission: async (submissionId) => {
        return prisma.submission.delete({
            where: { id: submissionId },
        });
    },
};

module.exports = submissionRepository;
