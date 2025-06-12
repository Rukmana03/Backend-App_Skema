const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const studentClassRepository = {
    addStudentToClass: async ({ classId, studentId, academicYearId, classStatus = "Active" }) => {
        return await prisma.studentClass.create({
            data: {
                class: {  
                    connect: {
                        id: Number(classId), 
                    }
                },
                academicYear: {
                    connect: {
                        id: Number(academicYearId),
                    }
                },
                student: {  
                    connect: {
                        id: Number(studentId), 
                    }
                },
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
            include: { class: true, academicYear: true }
        });
    },

    getActiveStudentsByClassId: async (classId) => {
        return await prisma.studentClass.findMany({
            where: {
                classId: Number(classId),
                classStatus: {
                    in: ["Active", "DroppedOut", "Promoted", "Transferred", "Graduated"]

                },
                student: {
                    role: "Student",
                },
            },
            include: {
                student: {
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