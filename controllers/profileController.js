const profileService = require("../services/profileService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const profileController = {
    createProfile: async (req, res) => {
        try {
            const userId = req.user.id; 
            const { name, identityNumber, bio, profilePhoto } = req.body;

            const profile = await profileService.createProfile({ userId, name, identityNumber, bio, profilePhoto });

            return successResponse(res, 201, "Profile created successfully", profile);
        } catch (error) {
            console.error("[ERROR] createProfile:", error.message);
            return errorResponse(res, error.status || 500, error.message);
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            const updatedProfile = await profileService.updateProfile(userId, req.body);

            return successResponse(res, 200, "Profile updated successfully", updatedProfile);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message);
        }
    },

    deleteProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            await profileService.deleteProfile(userId);

            return successResponse(res, 200, "Profile deleted successfully");
        } catch (error) {
            console.error("[ERROR] deleteProfile:", error.message);
            return errorResponse(res, error.status || 500, error.message);
        }
    },

    getAllProfiles: async (req, res) => {
        try {
            const profiles = await profileService.getAllProfiles();
            return successResponse(res, 200, "Profiles retrieved successfully", profiles);
        } catch (error) {
            return errorResponse(res, error.status || 500, error.message);
        }
    },

    getProfileById: async (req, res) => {
        try {
            const requestingUserId = req.user.id;

            const profile = await profileService.getProfileByUserId(requestingUserId, requestingUserId);

            return successResponse(res, 200, "Profile retrieved successfully", profile);
        } catch (error) {
            console.error("[ERROR] getProfileById:", error.message);
            return errorResponse(res, error.status || 500, error.message);
        }
    },
};

module.exports = profileController;
