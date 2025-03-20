const schoolService = require("../services/schoolService");

const schoolController = {
    getAllSchools: async (req, res) => {
        try {
            const schools = await schoolService.getAllSchools();
            res.json(schools);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getSchoolById: async (req, res) => {
        try {
            const { id } = req.params;
            const school = await schoolService.getSchoolById(id);
            if (!school) {
                return res.status(404).json({ message: "School not found" });
            }
            res.json(school);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createSchool: async (req, res) => {
        try {
            const school = await schoolService.createSchool(req.body);
            res.status(201).json(school);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateSchool: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedSchool = await schoolService.updateSchool(id, req.body);
            res.json(updatedSchool);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteSchool: async (req, res) => {
        try {
            const { id } = req.params;
            await schoolService.deleteSchool(id);
            res.json({ message: "School deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = schoolController;
