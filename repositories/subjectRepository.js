const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const subjectRepository = {
    createSubject: async (subjectName, description) => {
        return await prisma.subject.create({
            data: {
                subjectName,
                description
            }
        });
    },

    getAllSubjects: async () => {
        return await prisma.subject.findMany({
            where: { deletedAt: null },
            select: {
                id: true,
                subjectName: true,
                subjectClasses: {
                    select: {
                        subjectClassCode: true,
                        teacherId: true,
                        academicYearId: true,
                        classId: true,
                    },
                },
            },
        });
    },

    getSubjectById: async (id) => {
        return await prisma.subject.findUnique({
            where: { id, deletedAt: null },
            select: {
                id: true,
                subjectName: true,
                subjectClasses: {
                    select: {
                        subjectClassCode: true,
                        teacher: {
                            select: {
                                profile: {
                                    select: { name: true, bio: true, }
                                },
                            },
                        },
                        academicYear: {
                            select: {
                                year: true,
                            },
                        },
                        class: {
                            select: {
                                className: true,
                            },
                        },
                    },
                },
            },
        });
    },

    getSubjectByName: async (subjectName) => {
        return await prisma.subject.findFirst({
            where: { subjectName, deletedAt: null }
        });
    },

    updateSubject: async (id, data) => {
        return await prisma.subject.update({
            where: { id },
            data
        });
    },

    deleteSubject: async (id) => {
        return await prisma.subject.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    },

};

module.exports = subjectRepository;
