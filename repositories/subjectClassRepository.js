const { PrismaClient, ClassStatus } = require("@prisma/client");
const prisma = new PrismaClient();

const subjectClassRepository = {
    create: async (data) => {
        return await prisma.subjectClass.create({
            data: {
                subjectId: data.subjectId,
                classId: data.classId,
                teacherId: data.teacherId,
                academicYearId: data.academicYearId,
                subjectClassCode: data.subjectClassCode,
            }
        });
    },

    findAll: async () => {
        return await prisma.subjectClass.findMany({
            select: {
                id: true,
                subjectClassCode: true,
                subjectId: true,
                classId: true,
                teacherId: true,
                academicYearId: true,
            },
        });
    },

    findByClassId: async (classId) => {
        return await prisma.subjectClass.findMany({
            where: { classId },
            select: {
                id: true,
                subjectClassCode: true,
                subjectId: true,
                subject: {
                    select: { subjectName: true, description: true, },
                },
                teacherId: true,
                teacher: {
                    select: {
                        profile: {
                            select: { name: true, bio: true, },
                        },
                    },
                },
                academicYearId: true,
                academicYear: {
                    select: { year: true, isActive: true, },
                },
            }
        });
    },

    findClassById: async (classId) => {
        return await prisma.class.findUnique({
            where: { id: classId }
        });
    },

    findBySubjectAndClass: async (subjectClassId) => {
        return await prisma.subjectClass.findUnique({
            where: { id: subjectClassId },
            include: {
                subject: true,
                teacher: true,
                class: {
                    include: {
                        studentClasses: {
                            where: { classStatus: 'Active' },
                            include: {
                                student: true,
                            }
                        },
                    },
                },
            },
        });
    },

    findSubjectById: async (subjectId) => {
        return await prisma.subject.findUnique({
            where: { id: subjectId }
        });
    },

    findByTeacherId: async (teacherId) => {
        return await prisma.subjectClass.findMany({
            where: { teacherId },
            select: {
                id: true,
                teacher: {
                    select:{ 
                        role: true,
                        profile: {
                            select: { name: true, },
                        },
                    },
                },
                subjectClassCode: true,
                subjectId: true,
                subject: {
                    select: { subjectName: true, description: true, },
                },
                classId: true,
                class: {
                    select: { schoolId: true, className: true, },
                },
                academicYearId: true,
                academicYear: {
                    select: { year: true, },
                },
            }
        });
    },

    update: async (id, data) => {
        return await prisma.subjectClass.update({
            where: { id },
            data
        });
    },

    remove: async (id) => {
        return await prisma.subjectClass.delete({
            where: { id }
        });
    }
};

module.exports = subjectClassRepository;
