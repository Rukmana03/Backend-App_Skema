const academicYearRepository = require('../repositories/academicYearRepository');
const { throwError } = require('../utils/responseHandler');
const { createAcademicYearSchema, updateAcademicYearSchema } = require('../validations/academicYearValidation');

const academicYearService = {
    createAcademicYear: async (payload) => {
        const { value, error } = createAcademicYearSchema.validate(payload);
        if (error) throwError(400, error.details[0].message);

        // Jika isActive true, nonaktifkan yang lain
        if (value.isActive) {
            await academicYearRepository.deactivateAllYears();
        }

        return await academicYearRepository.createAcademicYear(value);
    },

    getAllAcademicYears: async () => {
        return await academicYearRepository.getAllAcademicYears();
    },

    getAcademicYearById: async (id) => {
        const year = await academicYearRepository.getAcademicYearById(id);
        if (!year) throwError(404, "Academic year not found");
        return year;
    },

    getActiveAcademicYear: async () => {
        const active = await academicYearRepository.getActiveAcademicYear();
        if (!active) throwError(404, "Tidak ada tahun ajaran yang aktif.");
        return active;
    },

    getInActiveAcademicYear: async () => {
        const inactive = await academicYearRepository.getInActiveAcademicYear();
        if (!inactive) throwError(404, "Tidak ada tahun ajaran yang tidak aktif.");
        return inactive;
    },

    updateAcademicYear: async (id, payload) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) throwError(400, "ID tidak valid.");

        const existing = await academicYearRepository.getAcademicYearById(parsedId);
        if (!existing) throwError(404, "Tahun ajaran tidak ditemukan.");

        const { value, error } = updateAcademicYearSchema.validate(payload);
        if (error) throwError(400, error.details[0].message);

        if (value.isActive === true) {
            await academicYearRepository.deactivateAllYears();
        }

        return await academicYearRepository.updateAcademicYear(parsedId, value);
    },

    deleteAcademicYear: async (id) => {
        const parsedId = Number(id);
        if (isNaN(parsedId)) throwError(400, "ID tidak valid.");

        const existing = await academicYearRepository.getAcademicYearById(parsedId);
        if (!existing) throwError(404, "Tahun ajaran tidak ditemukan.");

        return await academicYearRepository.deleteAcademicYear(parsedId);
    },
};

module.exports = academicYearService;
