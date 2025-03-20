const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const assignmentRepository = {
    validAssignmentTypes: ["Daily", "Weekly"],
    validTaskCategories: ["Essay", "MultipleChoice", "Project"],

    // Cek apakah class, subject, dan teacher ada di database
    validateAssignmentData: async ({ subjectClassId, teacherId }) => {
        console.log("Validating Assignment Data:", { subjectClassId, teacherId });

        if (!subjectClassId || !teacherId) {
            throw new Error(`Invalid input: subjectClassId=${subjectClassId}, teacherId=${teacherId}`);
        }

        const subjectExists = await prisma.subjectClass.findFirst({
            where: { id: Number(subjectClassId) },
        });

        const teacherExists = await prisma.user.findUnique({
            where: { id: Number(teacherId) },
        });

        if (!subjectExists) throw new Error("Subject class not found.");
        if (!teacherExists || teacherExists.role !== "Teacher") {
            throw new Error("Teacher not found or user is not a teacher.");
        }

        return { subjectExists, teacherExists };
    },

    findAssignmentByTitleAndClass: async (title, subjectClassId) => {

        const existingAssignment = await prisma.assignment.findFirst({
            where: {
                title,
                subjectClassId: subjectClassId, // Sesuaikan dengan field di database
            }
        });

        return existingAssignment;
    },

    createAssignment: async (data) => {
        return await prisma.assignment.create({
            data: {
                title: data.title,
                description: data.description,
                deadline: data.deadline,
                assignmentType: data.assignmentType,
                taskCategory: data.taskCategory,
                subjectClassId: data.subjectClassId,
                teacherId: data.teacherId
            }
        });
    },

    getAllAssignments: async () => {
        return await prisma.assignment.findMany({
            where: { deletedAt: null },
            include: {
                subjectClass: {
                    include: {
                        subject: { select: { id: true, subjectName: true } },
                        class: { select: { id: true, className: true } },
                        teacher: { select: { id: true, username: true, email: true } }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
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
