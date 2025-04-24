const subjectClassRepository = require("../repositories/subjectClassRepository");
const { createSubjectClassSchema } = require("../validations/subjectClassValidation");
const { throwError } = require("../utils/responseHandler");
const slugify = require("../utils/slugify");

const subjectClassService = {
    createSubjectClass: async (data) => {
        const { error, value } = createSubjectClassSchema.validate(data);
        if (error) throwError(400, error.details[0].message);

        const exists = await subjectClassRepository.findBySubjectAndClass(
            value.subjectId,
            value.classId
        );
        if (exists) {
            throwError(400, "Subject is already connected to this class");
        }

        const subjectName = await subjectClassRepository.findSubjectById(value.subjectId);
        if (!subjectName) {
            throwError(404, "Subject not found");
        }

        const classData = await subjectClassRepository.findClassById(value.classId);
        if (!classData) {
            throwError(404, "Class not found");
        }

        if (!subjectName.subjectName || !classData.className) {
            throwError(500, "Failed to generate code because subject/class has no name");
        }

        const subjectClassCode = `${slugify(subjectName.subjectName)}-${slugify(classData.className)}`;

        const created = await subjectClassRepository.create({
            subjectId: value.subjectId,
            classId: value.classId,
            teacherId: value.teacherId,
            academicYearId: value.academicYearId,
            subjectClassCode: subjectClassCode
        });

        return created;
    },

    getAllSubjectClasses: async () => {
        return await subjectClassRepository.findAll();
    },

    getSubjectClassesByClass: async (classId) => {
        return await subjectClassRepository.findByClassId(Number(classId));
    },

    getSubjectClassesByTeacher: async (teacherId) => {
        return await subjectClassRepository.findByTeacherId(Number(teacherId));
    },

    findBySubjectAndClass: async (subjectId, classId) => {
        return await prisma.subjectClass.findFirst({
            where: {
                subjectId,
                classId
            }
        });
    },

    updateSubjectClass: async (id, data) => {
        return await subjectClassRepository.update(Number(id), data);
    },

    deleteSubjectClass: async (id) => {
        return await subjectClassRepository.remove(Number(id));
    }
};

module.exports = subjectClassService;
