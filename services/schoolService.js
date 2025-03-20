const schoolRepository = require("../repositories/schoolRepository");

const schoolService = {
    getAllSchools: async() => {
        return await schoolRepository.findAll();
    },

    getSchoolById: async (id) => {
        return await schoolRepository.findById(id);
    },

    createSchool: async (data) => {
        return await schoolRepository.create(data);
    },

    updateSchool: async (id, data) => {
        return await schoolRepository.update(id, data);
    },

    deleteSchool: async (id) => {
        return await schoolRepository.delete(id);
    },
};

module.exports = schoolService;
