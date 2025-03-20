const profileRepository = require("../repositories/profileRepository");

const profileService = {
    createProfile: async ({ userId, name, identityNumber, bio, profilePhoto }) => {
        const existingProfile = await profileRepository.getProfileByUserId(userId);
        if (existingProfile) {
            throw new Error("Profile already exists");
        }

        const profile = await profileRepository.createProfile({ userId, name, identityNumber, bio, profilePhoto });
        return { message: "Profile created successfully", profile };
    },

    getProfile: async (userId) => {
        const profile = await profileRepository.getProfileByUserId(userId);
        if (!profile) {
            throw new Error("Profile not found");
        }

        return { message: "Profile retrieved successfully", profile };
    },

    updateProfile: async (userId, data) => {
        const existingProfile = await profileRepository.getProfileByUserId(userId);
        if (!existingProfile) {
            throw new Error("Profile not found");
        }

        const updatedProfile = await profileRepository.updateProfile(userId, data);
        return { message: "Profile updated successfully", updatedProfile };
    },

    deleteProfile: async (userId) => {
        const existingProfile = await profileRepository.getProfileByUserId(userId);
        if (!existingProfile) {
            throw new Error("Profile not found");
        }

        await profileRepository.deleteProfile(userId);
        return { message: "Profile deleted successfully" };
    },
};

module.exports = profileService;
