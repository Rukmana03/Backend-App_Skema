const assignmentRepository = require("../repositories/assignmentRepository");
const subjectClassRepository = require("../repositories/subjectClassRepository");
const notificationService = require("../services/notificationService");
const folderHelper = require("../utils/folderHelper");
const { assignmentValidator, updateAssignment } = require("../validations/assignmentValidator");
const { throwError } = require("../utils/responseHandler");

const assignmentService = {
    createAssignment: async (data) => {
        const { error } = assignmentValidator.validate(data);
        if (error) throwError(400, error.details[0].message);

        const { title, subjectClassId } = data;

        const existingAssignment = await assignmentRepository.findAssignmentByTitleAndClass(title, subjectClassId);
        if (existingAssignment) throwError(400, `Assignment "${title}" already available.`);

        const subjectClasses = await subjectClassRepository.findBySubjectAndClass(subjectClassId);
        if (!subjectClasses) throwError(404, "SubjectClass not found");
        if (!subjectClasses.class) throwError(404, "Class not found");
        if (!subjectClasses.subject) throwError(404, "Subject not found");
        if (!subjectClasses.teacher) throwError(404, "Teacher not found")

        const schoolId = subjectClasses.class.schoolId;
        const subjectId = subjectClasses.subjectId;

        const assignment = await assignmentRepository.createAssignment({ ...data });

        folderHelper.createAssignmentFolder(
            schoolId,
            subjectClasses.classId,
            subjectId,
            assignment.id
        );

        const activeStudents = subjectClasses.class.studentClasses || [];
        if (activeStudents.length > 0) {
            await Promise.all(
                activeStudents.map(async (sc) => {
                    const studentId = sc.student?.id;
                    if (studentId) {
                        try {
                            await notificationService.sendNotification({
                                userId: studentId,
                                message: `New assignment "${title}" has been added.`
                            });
                            console.log(`Notification successfully sent to student with ID: ${studentId}`);
                        } catch (error) {
                            console.error(`Failed to send notification to student with ID: ${studentId}`, error);
                        }
                    } else {
                        console.warn("Invalid student ID:", sc);
                        return Promise.resolve();
                    }
                })
            );
        }
        return assignment;
    },

    getAllAssignments: async () => {
        const assignments = await assignmentRepository.getAllAssignments();

        if (!Array.isArray(assignments) || assignments.length === 0) {
            throwError(404, "Assignment not found");
        }

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
        const { error } = updateAssignment.validate(data);
        if (error) throwError(400, error.details[0].message);

        const existingAssignment = await assignmentRepository.getAssignmentById(id);
        if (!existingAssignment) throwError(404, "Assignment not found");

        return await assignmentRepository.updateAssignment(id, data);
    },

    deleteAssignment: async (id) => {
        return await assignmentRepository.deleteAssignment(id);
    },
};

module.exports = assignmentService;
