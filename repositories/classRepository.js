const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const classRepository = {
    createClass: async (data) => {
        return await prisma.class.create({ data });
    },

    getAllClasses: async () => {
        return await prisma.class.findMany({
            where: { deletedAt: null },
            select: {
                id: true,
                schoolId: true,
                className: true,
                status: true,
            }
        });
    },

    getClassById: async (id) => {
        return await prisma.class.findUnique({
            where: { id: Number(id) },
            include: { subjectClasses: true }
        });
    },

    updateClass: async (id, data) => {
        return await prisma.class.update({
            where: { id: Number(id) },
            data,
        });
    },

    deleteClass: async (id) => {
        return await prisma.class.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() },
        });
    },

    addStudentToClass: async (classId, studentId) => {
        return await prisma.studentClass.create({
            data: {
                classId: Number(classId),
                studentId: Number(studentId),
                status: "Active"
            },
        });
    },

    deactivateStudentInClass: async (classId, studentId) => {
        return await prisma.studentClass.updateMany({
            where: {
                classId: Number(classId),
                studentId: Number(studentId),
                status: "Active",
            },
            data: { status: "Inactive" },
        });
    },

    getClassDetails: async (classId) => {
        return await prisma.class.findUnique({
            where: { id: Number(classId) },
            include: {
                studentClasses: {
                    include: {
                        Student: {
                            select: { id: true, username: true, email: true },
                        }
                    },
                },
                subjectClasses: {
                    include: {
                        subject: {
                            select: { id: true, subjectName: true, description: true }
                        },
                        teacher: {
                            select: { id: true, username: true, email: true }
                        }
                    },
                },
            },
        });
    },

    moveStudent: async (studentClassId, newClassId) => {
        return await prisma.studentClass.update({
            where: { id: Number(studentClassId) },
            data: { classId: Number(newClassId) },
        });
    },

    getActiveStudentClass: async (classId) => {
        return await prisma.studentClass.findMany({
            where: { classId: Number(classId), status: "Active" },
            include: { Student: true }
        });
    },

    findStudentInClass: async (studentId, classId) => {
        return await prisma.studentClass.findFirst({
            where: {
                studentId,
                classId,
                status: "Active",
            },
        });
    },

    getSubjectClassById: async (id) => {
        return await prisma.subjectClass.findUnique({
            where: { id },
            select: {
                id: true,
                classId: true,
                teacherId: true,
            },
        });
    },

    getSubjectsByClassId: async (classId) => {
        return await prisma.subjectClass.findMany({
            where: { classId: Number(classId) },
            include: {
                subject: { select: { id: true, subjectName: true } },
                teacher: { select: { id: true, username: true, email: true } }
            }
        });
    },

    findClassByNameAndSchool: async (schoolId, className) => {
        return await prisma.class.findFirst({
            where: {
                schoolId: Number(schoolId),
                className: className,
            }
        });
    },
};

module.exports = classRepository;
