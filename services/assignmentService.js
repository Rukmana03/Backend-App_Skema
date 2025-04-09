const assignmentRepository = require("../repositories/assignmentRepository");
const subjectRepository = require("../repositories/subjectRepository");
const notificationService = require("../services/notificationService");
const folderHelper = require("../utils/folderHelper");
const { assignmentValidator, updateAssignment  } = require("../validations/assignmentValidator");
const { throwError } = require("../utils/responseHandler");

const assignmentService = {
    createAssignment: async (data) => {
        // ✨ Validasi request
        const { error } = assignmentValidator.validate(data);
        if (error) throwError(400, error.details[0].message);

        const { title, subjectClassId, teacherId } = data;

        // ✨ Cek duplikat assignment (title unik per subjectClass)
        const existingAssignment = await assignmentRepository.findAssignmentByTitleAndClass(title, subjectClassId);
        if (existingAssignment) throwError(400, `Assignment "${title}" sudah ada.`);

        // ✨ Ambil subjectClass + relasinya
        const subjectClass = await subjectRepository.getSubjectClassWithDetails(subjectClassId);
        if (!subjectClass) throwError(404, "SubjectClass tidak ditemukan.");
        if (!subjectClass.class) throwError(404, "Class tidak ditemukan.");
        if (!subjectClass.subject) throwError(404, "Subject tidak ditemukan.");

        const { schoolId } = subjectClass.class;
        const subjectId = subjectClass.subject.id;

        // ✨ Simpan assignment baru
        const assignment = await assignmentRepository.createAssignment({
            ...data
        });

        // ✨ Buat folder assignment
        folderHelper.createAssignmentFolder(
            schoolId,
            subjectClass.class.id,
            subjectId,
            assignment.id
        );

        // ✨ Kirim notifikasi ke student aktif
        const activeStudents = subjectClass.class.studentClasses?.filter(sc => sc.status === "Active") || [];
        if (activeStudents.length > 0) {
            await Promise.all(
                activeStudents.map(student =>
                    notificationService.sendNotification(
                        student.studentId,
                        `Tugas baru "${title}" telah ditambahkan.`
                    )
                )
            );
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
        // Validasi input update assignment
        const { error } = updateAssignment.validate(data);
        if (error) throwError(400, error.details[0].message);

        // Pastikan assignment ada
        const existingAssignment = await assignmentRepository.getAssignmentById(id);
        if (!existingAssignment) throwError(404, "Assignment tidak ditemukan.");

        // Update assignment
        return await assignmentRepository.updateAssignment(id, data);
    },

    deleteAssignment: async (id) => {
        return await assignmentRepository.deleteAssignment(id);
    },
};

module.exports = assignmentService;
