const profileRepository = require("../repositories/profileRepository");
const { throwError, successResponse } = require("../utils/responeHandler");

const profileService = {
    createProfile: async ({ userId, name, identityNumber, bio, profilePhoto }) => {
        const existingProfile = await profileRepository.getProfileByUserId(userId);
        if (existingProfile) {
            throwError(400, "Profile already exists");
        }

        const profile = await profileRepository.createProfile({ userId, name, identityNumber, bio, profilePhoto });
        return successResponse(201, "Profile created successfully", profile);
    },

    getProfile: async (userId) => {
        const profile = await profileRepository.getProfileByUserId(userId);
        if (!profile) {
            throwError(404, "Profile not found");
        }

        return successResponse(200, "Profile retrieved successfully", profile);
    },

    updateProfile: async (userId, data) => {
        const existingProfile = await profileRepository.getProfileByUserId(userId);
        if (!existingProfile) {
            throwError(404, "Profile not found");
        }

        const updatedProfile = await profileRepository.updateProfile(userId, data);
        return successResponse(200, "Profile updated successfully", updatedProfile);
    },

    deleteProfile: async (userId) => {
        const existingProfile = await profileRepository.getProfileByUserId(userId);
        if (!existingProfile) {
            throwError(404, "Profile not found");
        }

        await profileRepository.deleteProfile(userId);
        return successResponse(200, "Profile deleted successfully");
    },
};

module.exports = profileService;
