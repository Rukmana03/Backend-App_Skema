const schoolRepository = require("../repositories/schoolRepository");
const folderHelper = require("../utils/folderHelper");
const { schoolSchema, updateSchoolSchema } = require("../validations/schoolValidator");
const { throwError } = require("../utils/responseHandler");

const schoolService = {
    createSchool: async (data) => {
        // Validate payload
        const { error } = schoolSchema.validate(data);
        if (error) throwError(400, error.details[0].message);

        // Cek duplikat NPSN
        const existingSchool = await schoolRepository.findByNpsn(data.npsn);
        if (existingSchool) throwError(409, "NPSN is already registered");

        // Create school
        const school = await schoolRepository.create({
            npsn: data.npsn,
            name: data.name,
            address: data.address,
            city: data.city,
            province: data.province,
            postalCode: data.postalCode,
            phoneNumber: data.phoneNumber,
            email: data.email,
        });

        // Create related folder
        folderHelper.createSchoolFolder(school.id);

        return school;
    },

    updateSchool: async (id, data) => {
        const schoolId = Number(id);
        if (isNaN(schoolId)) throwError(400, "Invalid school ID");

        // Validate payload
        const { error } = updateSchoolSchema.validate(data);
        if (error) throwError(400, error.details[0].message);

        // Make sure the school exists
        const existingSchool = await schoolRepository.findById(schoolId);
        if (!existingSchool) throwError(404, "School not found");

        // Update school
        return await schoolRepository.update(schoolId, data);
    },

    deleteSchool: async (id) => {
        const schoolId = Number(id);
        if (isNaN(schoolId)) throwError(400, "Invalid school ID");

        // Make sure the school exists
        const existingSchool = await schoolRepository.findById(schoolId);
        if (!existingSchool) throwError(404, "School not found");

        // Soft delete
        await schoolRepository.delete(schoolId);
    },

    getAllSchools: async () => {
        const schools = await schoolRepository.findAll();
        if (!schools || schools.length === 0) {
            throwError(404, "School not found");
        }
        return schools;
    },

    getSchoolById: async (id) => {
        const schoolId = Number(id);
        if (isNaN(schoolId)) throwError(400, "Invalid school ID");

        const school = await schoolRepository.findById(schoolId);
        if (!school) throwError(404, "School not found");

        return school;
    },
};

module.exports = schoolService;
