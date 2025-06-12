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
                school: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                academicYear: {
                    select: {
                        id: true,
                        year: true,
                    },
                },
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

    getClassDetails: async (classId) => {
        return await prisma.class.findUnique({
            where: { id: Number(classId) },
            include: {
                studentClasses: {
                    include: {
                        student: {
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

    findStudentInClass: async (studentId, classId) => {
        return await prisma.studentClass.findFirst({
            where: {
                studentId,
                classId,
            },
        });
    },
};

module.exports = classRepository;

