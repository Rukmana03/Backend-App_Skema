const { PrismaClient } = require("@prisma/client");
const { throwError } = require("../utils/responeHandler");
const prisma = new PrismaClient();

const subjectRepository = {
    createSubject: async (subjectName, description, classId, teacherId) => {

        const newSubject = await prisma.subject.create({
            data: { subjectName, description }
        });
        const newSubjectClass = await prisma.subjectClass.create({
            data: {
                subjectId: newSubject.id,
                classId: Number(classId),
                teacherId: Number(teacherId),
                code: `SUB-${newSubject.id}-${classId}-${teacherId}`
            }
        });
        return { newSubject, newSubjectClass };
    },

    findAllSubjects: async () => {
        const subjects = await prisma.subject.findMany({
            include: { subjectClasses: { include: { class: true, teacher: { select: { id: true, username: true, email: true } } } } }
        });
        return subjects.map(subject => ({
            id: subject.id,
            subjectName: subject.subjectName,
            description: subject.description,
            code: subject.subjectClasses?.[0]?.code || null,
            createdAt: subject.createdAt,
            updatedAt: subject.updatedAt,
            classes: subject.subjectClasses.map(sc => ({
                classId: sc.classId,
                teacher: sc.teacher
                    ? { id: sc.teacher.id, name: sc.teacher.username, email: sc.teacher.email }
                    : null
            }))
        }));
    },

    findSubjectById: async (id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
            throwError(400, "Invalid subject ID");
        }

        const subject = await prisma.subject.findUnique({
            where: { id: parsedId },
        });

        if (!subject) {
            throwError(400, "Subject not found")
        }

        return subject;
    },

    updateSubject: async (id, subjectName, description) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) {
            throw new Error("Invalid subject ID");
        }

        const subjectExists = await prisma.subject.findUnique({
            where: { id: parsedId },
        });

        if (!subjectExists) {
            throw new Error("Subject not found");
        }

        return await prisma.subject.update({
            where: { id: parsedId },
            data: {
                subjectName: subjectName || subjectExists.subjectName,
                description: description || subjectExists.description,
                updatedAt: new Date()
            },
        });
    },

    deleteSubject: async (id) => {
        const parsedId = Number(id); // Konversi ke integer
        if (isNaN(parsedId)) {
            throw new Error("Invalid subject ID"); // Tangani jika bukan angka
        }

        return await prisma.subject.delete({
            where: { id: parsedId },
        });
    },

    getSubjectByName: async (name) => {
        return await prisma.subject.findFirst({
            where: { subjectName: name },
        });
    },

    addTeacherToSubject: async (subjectId, teacherId) => {
        const parsedSubjectId = Number(subjectId);
        const parsedTeacherId = Number(teacherId);

        if (isNaN(parsedSubjectId) || isNaN(parsedTeacherId)) {
            throw new Error("Invalid subject ID or teacher ID");
        }

        const teacherExists = await prisma.user.findUnique({
            where: { id: parsedTeacherId },
        });

        if (!teacherExists) {
            throw new Error("Teacher does not exist");
        }

        return await prisma.subject.update({
            where: { id: parsedSubjectId },
            data: {
                teacherId: parsedTeacherId,
            },
        });
    },

    getTeachersBySubjectId: async (subjectId) => {
        return await prisma.subject.findUnique({
            where: { id: Number(subjectId) },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
    },
};


module.exports = subjectRepository;
