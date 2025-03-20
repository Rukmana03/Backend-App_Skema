const schoolRepository = require("../repositories/schoolRepository");
const folderHelper = require("../utils/folderHelper");

const schoolService = {
    getAllSchools: async () => {
        return await schoolRepository.findAll();
    },

    getSchoolById: async (id) => {
        return await schoolRepository.findById(id);
    },

    createSchool: async (data) => {
        const school = await schoolRepository.create(data);
        folderHelper.createSchoolFolder(school.id);
        return school;
    },

    updateSchool: async (id, data) => {
        return await schoolRepository.update(id, data);
    },

    deleteSchool: async (id) => {
        return await schoolRepository.delete(id);
    },
};

module.exports = schoolService;
