const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const subjectRepository = {
    createSubject: async (data) => {
        return await prisma.subject.create({ data });
    },

    getAllSubjects: async () => {
        return await prisma.subject.findMany({
            include: {
                subjectClasses: {
                    include: {
                        class: true,
                        teacher: {
                            select: { id: true, username: true, email: true }
                        }
                    }
                }
            }
        });
    },

    getSubjectById: async (id) => {
        return await prisma.subject.findUnique({
            where: { id },
            include: {
                subjectClasses: {
                    include: {
                        class: true,
                        teacher: {
                            select: { id: true, username: true, email: true }
                        }
                    }
                }
            }
        });
    },

    getSubjectByName: async (subjectName) => {
        return await prisma.subject.findFirst({
            where: { subjectName }
        });
    },

    updateSubject: async (id, data) => {
        return await prisma.subject.update({
            where: { id },
            data
        });
    },

    deleteSubject: async (id) => {
        return await prisma.subject.delete({
            where: { id }
        });
    },

    createSubjectClass: async (data) => {
        return await prisma.subjectClass.create({ data });
    },

    findClassById: async (classId) => {
        return await prisma.class.findUnique({
            where: { id: classId },
            select: { schoolId: true }
        });
    },

    findTeacherById: async (teacherId) => {
        return await prisma.user.findUnique({
            where: { id: teacherId }
        });
    },

};

module.exports = subjectRepository;
