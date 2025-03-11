const assignmentRepository = require("../repositories/assignmentRepository");
const notificationService = require("../services/notificationService")
const classRepository = require("../repositories/classRepository")

const assignmentService = {

    validAssignmentTypes: ["Daily", "Weekly"],
    validTaskCategories: ["Essay", "MultipleChoice", "Project"],

    createAssignment: async (assignmentData) => {
        const { deadline, classId, title, assignmentType, taskCategory } = assignmentData;
        const now = new Date();
        const deadlineDate = new Date(deadline);

        // Validasi format deadline
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

        // Buat assignment setelah validasi di repository
        const assignment = await assignmentRepository.createAssignment(assignmentData);

        // Ambil data kelas beserta murid yang tergabung
        const classData = await classRepository.getClassDetails(classId);

        // Filter hanya murid yang statusnya aktif
        const activeStudents = (classData.studentClasses || []).filter(student => student.status === "Active");

        // Kirim notifikasi ke setiap siswa yang aktif
        await Promise.all(activeStudents.map(student =>
            notificationService.sendNotification(student.id, `Tugas baru "${title}" telah ditambahkan.`)
        ));

        return assignment;
    },

    getAllAssignments: async () => {
        return await assignmentRepository.getAllAssignments();
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
