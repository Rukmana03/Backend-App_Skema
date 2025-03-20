const assignmentRepository = require("../repositories/assignmentRepository");
const notificationService = require("../services/notificationService")
const classRepository = require("../repositories/classRepository");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { throwError } = require("../utils/responeHandler")


const assignmentService = {

    validAssignmentTypes: ["Daily", "Weekly"],
    validTaskCategories: ["Essay", "MultipleChoice", "Project"],

    createAssignment: async (assignmentData) => {

        const { deadline, subjectClassId, title, assignmentType, taskCategory } = assignmentData;
        const now = new Date();

        if (!title || !subjectClassId) {

            throw new Error("Title dan classId wajib diisi.");
        }

        const existingAssignment = await assignmentRepository.findAssignmentByTitleAndClass(title, subjectClassId);
        if (existingAssignment) {
            throw new Error(`Assignment dengan judul "${title}" sudah ada di kelas ini.`);
        }
        // Validasi format deadline
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
            throwError(400, "Invalid deadline format.");
        }

        // Validasi deadline harus di masa depan
        if (deadlineDate <= now) {
            throwError(400, "Deadline must be set in the future.");
        }

        // Validasi assignmentType dan taskCategory
        if (!assignmentService.validAssignmentTypes.includes(assignmentType)) {
            throwError(400, `Invalid assignmentType. Allowed values: ${assignmentService.validAssignmentTypes.join(", ")}`);
        }

        if (!assignmentService.validTaskCategories.includes(taskCategory)) {
            throwError(400, `Invalid taskCategory. Allowed values: ${assignmentService.validTaskCategories.join(", ")}`);
        }

        const subjectClass = await prisma.subjectClass.findUnique({
            where: { id: Number(subjectClassId) },
            include: { class: { include: { studentClasses: true } } }
        });

        if (!subjectClass) {
            throw new Error("SubjectClass not found.");
        }

        const classData = subjectClass.class;
        if (!classData) {
            throw new Error("Class data not found.");
        }

        const activeStudents = classData.studentClasses
            ? classData.studentClasses.filter(student => student.status === "Active")
            : [];

        // Buat assignment setelah validasi di repository
        const assignment = await assignmentRepository.createAssignment(assignmentData);

        // Kirim notifikasi ke setiap siswa yang aktif
        if (activeStudents.length > 0) {
            await Promise.all(activeStudents.map(student =>
                notificationService.sendNotification(student.studentId, `Tugas baru "${title}" telah ditambahkan.`)
            ));
        } else {
            console.log("[DEBUG] Tidak ada siswa aktif, tidak ada notifikasi dikirim.");
        }

        return assignment;
    },

    getAllAssignments: async () => {
        const assignments = await assignmentRepository.getAllAssignments();
        return assignments.map(assignment => ({
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            deadline: assignment.deadline,
            assignmentType: assignment.assignmentType,
            taskCategory: assignment.taskCategory,
            subject: assignment.subjectClass ? {
                id: assignment.subjectClass.subject.id,
                name: assignment.subjectClass.subject.subjectName
            } : null,
            class: assignment.subjectClass ? {
                id: assignment.subjectClass.class.id,
                name: assignment.subjectClass.class.className
            } : null,
            teacher: assignment.subjectClass ? {
                id: assignment.subjectClass.teacher.id,
                name: assignment.subjectClass.teacher.username,
                email: assignment.subjectClass.teacher.email
            } : null
        }));
    },

    getAssignmentById: async (id) => {
        return await assignmentRepository.getAssignmentById(id);
    },

    updateAssignment: async (id, data) => {
        return await assignmentRepository.updateAssignment(id, data);
    },

    deleteAssignment: async (id) => {
        return await assignmentRepository.deleteAssignment(id);
    },
};

module.exports = assignmentService;

// const addComment = async (assignmentId, userId, content) => {
//     return await assignmentRepository.addComment(assignmentId, userId, content);
// };
