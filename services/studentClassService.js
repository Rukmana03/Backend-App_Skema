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
        const academicYearId = activeClass[0].academicYearId;

        const newClass = await classRepository.getClassById(newClassId);
        if (!newClass || newClass.status !== "Active") {
            throwError(400, "Destination class is inactive or not found");
        }

        const updated = await studentClassRepository.updateClassStatus(studentId, academicYearId, "Transferred");
        if (updated.count === 0) {
            throwError(400, "Failed to deactivate old class data");
        }

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
            id: sc.student.id,
            username: sc.student.username,
            email: sc.student.email,
            status: sc.classStatus
        }));
    },

    promoteStudentsToClass: async (data) => {
        const { error } = promoteStudentsSchema.validate(data);
        if (error) throwError(400, error.details[0].message);
    
        const { studentIds, newClassId, academicYearId } = data;

        console.log("Incoming academicYearId for promotion:", academicYearId);
        console.log("Incoming student IDs for promotion:", studentIds);
        console.log("Incoming newClassId for promotion:", newClassId);

        const newClass = await classRepository.getClassById(newClassId);

        if (!newClass || newClass.status !== "Active") {    
            throwError(400, "Destination class is inactive or not found");
        }

        console.log("New class data:", newClass);
        console.log("New class academicYearId:", newClass.academicYearId);

        const currentClasses = await studentClassRepository.getActiveStudentClass(studentIds[0]);
        const currentClass = currentClasses[0];

        if (!currentClass) {
            console.log("No active class found for student ID", studentIds[0]);
            throwError(400, "No active class found for student");
        }

        console.log("Current class ID for student:", currentClass.classId);
        console.log("Current class academicYearId:", currentClass.academicYearId);

        if(newClass.academicYearId === currentClass.academicYearId) {
            console.log("Student cannot be promoted to the same academic year.");
            throwError(400, "Student must be promoted to a different academic year");
        }

        if (newClassId <= currentClass.classId) {
            throwError(400, "Student cannot be promoted to a lower class");
        }

        const results = [];

        for (const studentId of studentIds) {
            const user = await userRepository.findUserById(studentId);
            if (!user || user.role !== "Student") {
                throwError(400, `User with ID ${studentId} not s student`);
            }

            const activeClasses = await studentClassRepository.getActiveStudentClass(studentId);

            console.log("Active classes for student ID:", studentId);
            console.log("Active classes data:", activeClasses);

            const alreadyInClass = activeClasses.some((activeClass) => activeClass.classId === newClassId);
            if (alreadyInClass) {
                throwError(400, `Students with ID ${studentId} already in this class`);
            }
            const currentActive = activeClasses.find(ac => ac.classStatus === "Active");

            if(!currentActive){
                throwError(400, `Students with ID ${studentId} has not active class`);
            }
            console.log("Current Active Class Academic Year:", currentActive.academicYearId);

            if(currentActive.academicYear.id === newClass.academicYearId){
                throwError(400, `Student with ID ${studentId} must be promoted to a different academic year`);
            }
    
            for (const active of activeClasses) {
                if (active.classStatus !== "Promoted") {
                    await studentClassRepository.updateClassStatus(studentId, active.academicYearId, "Promoted");
                }
            }

            const newRecord = await studentClassRepository.addStudentToClass({
                classId: newClassId,
                studentId,
                academicYearId,
                classStatus: "Active",
            });
            results.push(newRecord);
        }

        return results;
    },

};

module.exports = studentClassService;
