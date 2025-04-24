const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const studentClassRepository = {
    addStudentToClass: async ({ classId, studentId, academicYearId, classStatus = "Active" }) => {
        return await prisma.studentClass.create({
            data: {
                classId: Number(classId),
                studentId: Number(studentId),
                academicYearId: Number(academicYearId),
                classStatus,
            },
        });
    },

    moveStudent: async (studentClassId, newClassId) => {
        return await prisma.studentClass.update({
            where: { id: Number(studentClassId) },
            data: { classId: Number(newClassId), classStatus: "Transferred" },
        });
    },

    deactivateStudentInClass: async (classId, studentId) => {
        return await prisma.studentClass.updateMany({
            where: {
                classId: Number(classId),
                studentId: Number(studentId),
                classStatus: "Active",
            },
            data: { classStatus: "DroppedOut" },
        });
    },

    getActiveStudentClass: async (studentId) => {
        return await prisma.studentClass.findMany({
            where: { studentId: Number(studentId), classStatus: "Active" },
            include: { Class: true, AcademicYear: true }
        });
    },

    getActiveStudentsByClassId: async (classId) => {
        return await prisma.studentClass.findMany({
            where: {
                classId: Number(classId),
                Student: {
                    role: "Student",
                },
            },
            include: {
                Student:{
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                }
            },
        });
    },

    findStudentInClass: async (studentId, classId) => {
        return await prisma.studentClass.findFirst({
            where: {
                studentId: Number(studentId),
                classId: Number(classId),
                classStatus: "Active",
            },
        });
    },

    updateClassStatus: async (studentId, academicYearId, newStatus) => {
        return await prisma.studentClass.updateMany({
            where: {
                studentId: Number(studentId),
                academicYearId: Number(academicYearId),
                classStatus: "Active",
            },
            data: { classStatus: newStatus },
        });
    },

    updateStudentClassToNewClass: async ({ studentId, academicYearId, newClassId }) => {
        return await prisma.studentClass.updateMany({
            where: {
                studentId: Number(studentId),
                academicYearId: Number(academicYearId),
                classStatus: "Transferred", 
            },
            data: {
                classId: Number(newClassId),
                classStatus: "Active",
            },
        });
    },
    
};
module.exports = studentClassRepository;