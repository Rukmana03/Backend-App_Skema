const classRepository = require("../repositories/classRepository");
const studentClassRepository = require("../repositories/studentClassRepository");
const userRepository = require("../repositories/userRepository");
const { throwError } = require("../utils/responseHandler");
const { addStudentSchema, promoteStudentsSchema } = require("../validations/classValidation");

const studentClassService = {
    addStudentToClass: async (data) => {
        const { error } = addStudentSchema.validate(data);
        if (error) throwError(400, error.details[0].message);

        const { classId, studentId, academicYearId } = data;

        const existingClass = await classRepository.getClassById(classId);
        if (!existingClass || existingClass.deletedAt) throwError(404, "Class not found");

        const user = await userRepository.findUserById(studentId);
        if (!user || user.role !== "Student") {
            throwError(400, "Only users with the 'Student' role can be added to a class.");
        }

        const activeStudent = await studentClassRepository.getActiveStudentClass(studentId);

        const sameAcademicYear = activeStudent.find(
            s => s.academicYearId === academicYearId
        );

        if (sameAcademicYear) {
            throwError(400, "Student is already assigned to a class in this academic year");
        }

        return await studentClassRepository.addStudentToClass({
            classId,
            studentId,
            academicYearId,
            classStatus: "Active"
        });
    },

    deactivateStudentInClass: async (classId, studentId) => {
        if (!classId || !studentId) throwError(400, "classId and studentId are required");

        const result = await studentClassRepository.deactivateStudentInClass(classId, studentId);
        if (result.count === 0) {
            throwError(400, "Student is either not in this class or already DroppedOut");
        }
        return;
    },

    moveStudent: async (studentId, newClassId) => {
        if (!studentId || !newClassId) throwError(400, "studentId and newClassId are required");

        const activeClass = await studentClassRepository.getActiveStudentClass(studentId);
        if (!activeClass.length) throwError(400, "Student not found in any active classes");

        // Ambil academicYearId dari data aktif
        const academicYearId = activeClass[0].academicYearId;

        const newClass = await classRepository.getClassById(newClassId);
        if (!newClass || newClass.status !== "Active") {
            throwError(400, "Destination class is inactive or not found");
        }

        // Nonaktifkan kelas lama
        const updated = await studentClassRepository.updateClassStatus(studentId, academicYearId, "Transferred");
        if (updated.count === 0) {
            throwError(400, "Failed to deactivate old class data");
        }

        // Tambahkan ke kelas baru
        const result = await studentClassRepository.addStudentToClass({
            classId: newClassId,
            studentId,
            academicYearId,
            classStatus: "Active"
        });

        return result;
    },

    getActiveStudentsInClass: async (classId) => {
        if (!classId) throwError(400, "classId are required");

        const students = await studentClassRepository.getActiveStudentsByClassId(classId);
        if (!students.length) throwError(404, "There are no active students in this class");

        return students.map((sc) => ({
            id: sc.Student.id,
            username: sc.Student.username,
            email: sc.Student.email,
        }));
    },

    promoteStudentsToClass: async (data) => {
        const { error } = promoteStudentsSchema.validate(data);
        if (error) throwError(400, error.details[0].message);

        const { studentIds, newClassId, academicYearId } = data;

        const newClass = await classRepository.getClassById(newClassId);
        if (!newClass || newClass.status !== "Active") {
            throwError(400, "Destination class is inactive or not found");
        }

        const results = [];

        for (const studentId of studentIds) {
            const user = await userRepository.findUserById(studentId);
            if (!user || user.role !== "Student") {
                throwError(400, `User with ID ${studentId} not s student`);
            }

            const activeClasses = await studentClassRepository.getActiveStudentClass(studentId);

            // Periksa apakah siswa sudah ada di kelas baru
            const alreadyInClass = activeClasses.some((activeClass) => activeClass.classId === newClassId);
            if (alreadyInClass) {
                throwError(400, `Students with ID ${studentId} already in this class`);
            }

            // Update status kelas lama jika belum dipromosikan
            for (const active of activeClasses) {
                if (active.classStatus !== "Promoted") {
                    await studentClassRepository.updateClassStatus(studentId, active.academicYearId, "Promoted");
                }
            }

            // Tambahkan siswa ke kelas baru di tahun ajaran baru
            const newRecord = await studentClassRepository.addStudentToClass({
                classId: newClassId,
                studentId,
                academicYearId,
                classStatus: "Active",
            });

            results.push(newRecord);
        }

        return {
            message: "Semua siswa berhasil dipromosikan ke kelas baru",
            data: results,
        };
    },

};

module.exports = studentClassService;
