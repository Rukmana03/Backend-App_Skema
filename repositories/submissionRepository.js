const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const submissionRepository = {
    createSubmission: async (data) => {
        // Pastikan assignmentId dan studentId adalah angka
        if (!data.assignmentId || !Number.isInteger(data.assignmentId)) {
            throw new Error("assignmentId harus berupa angka yang valid.");
        }
        if (!data.studentId || !Number.isInteger(data.studentId)) {
            throw new Error("studentId harus berupa angka yang valid.");
        }

        // Cek apakah Assignment ada
        const assignment = await prisma.assignment.findUnique({
            where: { id: data.assignmentId },
        });
        if (!assignment) {
            throw new Error("Assignment tidak ditemukan.");
        }

        // Cek apakah Student ada
        const student = await prisma.user.findUnique({
            where: { id: data.studentId },
        });
        if (!student) {
            throw new Error("Student tidak ditemukan.");
        }

        // Pastikan fileUrl ada
        if (!data.fileUrl) {
            throw new Error("fileUrl harus diisi.");
        }

        // Validasi submissionDate dalam format ISO 8601
        const submissionDate = data.submissionDate ? new Date(data.submissionDate) : new Date();
        if (isNaN(submissionDate.getTime())) {
            throw new Error("submissionDate tidak valid. Harus dalam format ISO 8601.");
        }

        // Buat submission
        return await prisma.submission.create({
            data: {
                assignmentId: data.assignmentId,
                studentId: data.studentId,
                fileUrl: data.fileUrl,
                submissionDate: submissionDate.toISOString(), // Simpan dalam format ISO
                status: data.status || "Pending", // Default ke "Pending"
            },
        });
    },

    getAllSubmissions: async () => {
        return await prisma.submission.findMany({
            select: {
                id: true,
                fileUrl: true,
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
                }
            }
        });
    },

    getSubmissionById: async (id) => {
        return await prisma.submission.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                assignmentId: true,
                studentId: true,
                fileUrl: true,
                submissionDate: true,
                status: true,
                assignment: {
                    select: { id: true, title: true, teacherId: true }
                },
                student: {
                    select: { id: true, username: true }
                }
            }
        });
    },

    findSubmissionByStudent: async (submissionId, studentId) => {
        console.log("[DEBUG] Mencari submission...", { submissionId, studentId });

        const submission = await prisma.submission.findFirst({
            where: {
                id: Number(submissionId), // Gunakan ID Submission, bukan Assignment!
                studentId: Number(studentId)
            }
        });

        console.log("[DEBUG] Submission ditemukan:", submission);
        return submission;
    },

    updateSubmission: async (id, data) => {
        id = Number(id); // Pastikan id berupa number

        // Cek apakah submission ada sebelum update
        const existingSubmission = await prisma.submission.findUnique({
            where: { id },
        });
        if (!existingSubmission) {
            throw new Error("Submission tidak ditemukan");
        }

        return await prisma.submission.update({
            where: { id },
            data,
        });
    },

    updateSubmissionStatus: async (submissionId, newStatus) => {
        return await prisma.submission.update({
            where: { id: Number(submissionId) },
            data: { status: newStatus } // ✅ Perbaikan: newStatus harus dalam objek data
        });
    },

    deleteSubmission: async (id) => {
        return await prisma.submission.delete({
            where: { id: Number(id) },
        });
    },

};

module.exports = submissionRepository;

// const addCommentToSubmission = async (submissionId, commentData) => {
//     return await prisma.comment.create({
//         data: {
//             content: commentData.content,
//             userId: commentData.userId,
//             assignmentId: commentData.assignmentId,
//             submission: { connect: { id: Number(submissionId) } },
//             commentDate: new Date(),
//         },
//     });
// };

