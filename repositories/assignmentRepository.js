const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const assignmentRepository = {
    createAssignment: (data) =>
        prisma.assignment.create({ data }),

    updateAssignment: (id, data) =>
        prisma.assignment.update({ where: { id }, data }),

    deleteAssignment: (id) =>
        prisma.assignment.delete({ where: { id } }),

    findSubjectClassById: (id) =>
        prisma.subjectClass.findUnique({ where: { id } }),

    findTeacherById: (id) =>
        prisma.user.findUnique({ where: { id } }),

    findAssignmentByTitleAndClass: (title, subjectClassId) =>
        prisma.assignment.findFirst({ where: { title, subjectClassId } }),

    getAllAssignments: () =>
        prisma.assignment.findMany({
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
        }),

    getAssignmentById: (id) =>
        prisma.assignment.findUnique({ where: { id } }),

    getStudentsBySubjectClassId: (subjectClassId) =>
        prisma.studentClass.findMany({ where: { classId: subjectClassId }, select: { studentId: true } }),

    addComment: (data) =>
        prisma.comment.create({ data }),
};

module.exports = assignmentRepository;
