const profileService = require("../services/profileService");

const profileController = {
    createProfile: async (req, res, next) => {
        try {
            const { name, identityNumber, bio, profilePhoto } = req.body;
            const userId = req.user.id;
            const response = await profileService.createProfile({ userId, name, identityNumber, bio, profilePhoto });
            res.status(201).json(response);
        } catch (error) {
            console.error("[ERROR] createProfile:", error.message);
            return res.status(500).json({ message: "Terjadi kesalahan", error: error.message || "Unknown error" });
        }
    },

    getProfile: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const response = await profileService.getProfile(userId);
            res.status(200).json(response);
        } catch (error) {
            console.error("[ERROR] getProfile:", error.message);
            return res.status(500).json({ message: "Terjadi kesalahan", error: error.message || "Unknown error" });
        }
    },

    updateProfile: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const response = await profileService.updateProfile(userId, req.body);
            res.status(200).json(response);
        } catch (error) {
            console.error("[ERROR] updateProfile:", error.message);
            return res.status(500).json({ message: "Terjadi kesalahan", error: error.message || "Unknown error" });
        }
    },

    deleteProfile: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const response = await profileService.deleteProfile(userId);
            res.status(200).json(response);
        } catch (error) {
            console.error("[ERROR] deleteProfile:", error.message);
            return res.status(500).json({ message: "Terjadi kesalahan", error: error.message || "Unknown error" });
        }
    },
};

module.exports = profileController;
