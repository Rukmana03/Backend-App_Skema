const assignmentRepository = require("../repositories/assignmentRepository");
const notificationService = require("../services/notificationService");
const folderHelper = require("../utils/folderHelper");
const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

const validAssignmentTypes = ["Daily", "Weekly"];
const validTaskCategories = ["Essay", "MultipleChoice", "Project"];

const assignmentService = {
    createAssignment: async (assignmentData) => {
        try {
            console.log("[DEBUG] Data dari Request:", assignmentData);

            const { title, subjectClassId, teacherId, deadline, assignmentType, taskCategory } = assignmentData;
            if (!title || !subjectClassId || !teacherId) throw new Error("Title, subjectClassId, dan teacherId wajib diisi.");

            console.log("[DEBUG] Validasi assignmentType dan taskCategory...");
            if (!validAssignmentTypes.includes(assignmentType)) throw new Error(`Invalid assignmentType.`);
            if (!validTaskCategories.includes(taskCategory)) throw new Error(`Invalid taskCategory.`);

            console.log("[DEBUG] Validasi deadline...");
            const deadlineDate = new Date(deadline);
            if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) throw new Error("Deadline harus valid.");

            console.log("[DEBUG] Mengecek apakah assignment sudah ada...");
            const existingAssignment = await assignmentRepository.findAssignmentByTitleAndClass(title, subjectClassId);
            if (existingAssignment) throw new Error(`Assignment "${title}" sudah ada.`);

            console.log("[DEBUG] Mengambil subjectClass dari database...");
            const subjectClass = await prisma.subjectClass.findUnique({
                where: { id: Number(subjectClassId) },
                include: {
                    class: { include: { studentClasses: true } },
                    subject: true
                }
            });

            if (!subjectClass) throw new Error("SubjectClass tidak ditemukan.");
            if (!subjectClass.class) throw new Error("Class tidak ditemukan.");
            if (!subjectClass.subject) throw new Error("Subject tidak ditemukan.");

            const schoolId = subjectClass.class.schoolId;
            const subjectId = subjectClass.subject.id; // ✅ Pastikan subjectId dideklarasikan

            if (!schoolId) throw new Error("School ID tidak ditemukan dalam class.");
            if (!subjectId) throw new Error("subjectId tidak ditemukan dalam SubjectClass.");
            console.log("[DEBUG] schoolId:", schoolId);
            console.log("[DEBUG] subjectId:", subjectId);

            const assignment = await assignmentRepository.createAssignment({
                title,
                description: assignmentData.description,
                deadline,
                assignmentType,
                taskCategory,
                subjectClassId,
                teacherId
            });

            console.log("[DEBUG] Assignment berhasil dibuat:", assignment);

            // ✅ Perbaiki pemanggilan folder helper
            folderHelper.createAssignmentFolder(
                schoolId,
                subjectClass.class.id,
                subjectId,  // ✅ Gunakan subjectId, bukan subjectClassId
                assignment.id
            );

            console.log("[DEBUG] Mengambil siswa aktif...");
            const activeStudents = subjectClass.class.studentClasses?.filter(student => student.status === "Active") || [];
            if (activeStudents.length > 0) {
                console.log("[DEBUG] Mengirim notifikasi ke siswa aktif...");
                await Promise.all(
                    activeStudents.map(student =>
                        notificationService.sendNotification(student.studentId, `Tugas baru "${title}" telah ditambahkan.`)
                    )
                );
            } else {
                console.log("[DEBUG] Tidak ada siswa aktif, tidak ada notifikasi dikirim.");
            }

            return assignment;
        } catch (error) {
            console.error("[ERROR] Gagal membuat assignment:", error.message);
            throw new Error(error.message);
        }
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
