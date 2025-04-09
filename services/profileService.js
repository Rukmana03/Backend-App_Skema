const profileRepository = require("../repositories/profileRepository");
const profileSchema = require("../validations/profileValidaton");
const { throwError } = require("../utils/responseHandler");

const profileService = {
    createProfile: async ({ userId, name, identityNumber, bio, profilePhoto }) => {
        const { error } = profileSchema.validate({ name, identityNumber, bio, profilePhoto });
        if (error) throwError(400, error.details[0].message);

        const existingProfile = await profileRepository.getProfileByUserId(userId);
        if (existingProfile) throwError(400, "Profile already exists.");

        if (identityNumber) {
            const duplicateIdentity = await profileRepository.getProfileByIdentityNumber(identityNumber);
            if (duplicateIdentity) throwError(409, "Nomor identitas sudah digunakan.");
        }

        const profile = await profileRepository.createProfile({
            userId,
            name,
            identityNumber: identityNumber || null,
            bio: bio || "",
            profilePhoto: profilePhoto || "https://example.com/default-profile.jpg"
        });

        return profile;
    },

    updateProfile: async (userId, data) => {
        userId = Number(userId);
        if (isNaN(userId)) throwError(400, "Invalid user ID.");

        const existingProfile = await profileRepository.getProfileByUserId(userId);
        if (!existingProfile) throwError(404, "Profile not found.");

        const { error } = profileSchema.validate(data);
        if (error) throwError(400, error.details[0].message);

        if (data.identityNumber && data.identityNumber.trim() !== "") {
            const existingByIdentity = await profileRepository.getProfileByIdentityNumber(data.identityNumber);

            if (existingByIdentity && existingByIdentity.userId !== userId) {
                throwError(400, "Nomor identitas sudah digunakan oleh pengguna lain.");
            }
        }

        const updatedProfile = await profileRepository.updateProfile(userId, data);
        return updatedProfile;
    },

    deleteProfile: async (userId) => {
        userId = Number(userId);
        if (isNaN(userId)) throwError(400, "Invalid user ID.");

        const existingProfile = await profileRepository.getProfileByUserId(userId);
        if (!existingProfile) throwError(404, "Profile not found.");

        await profileRepository.deleteProfile(userId);
        return { message: "Profile deleted successfully." };
    },

    getAllProfiles: async (requestingUserRole) => {
        if (requestingUserRole !== "Admin") {
            throwError(403, "Only admins can access all profiles.");
        }

        const profiles = await profileRepository.getAllProfiles();
        if (!profiles || profiles.length === 0) throwError(404, "No profiles found.");
        return profiles;
    },

    getProfileByUserId: async (requestingUserId, targetUserId) => {
        targetUserId = Number(targetUserId);
        if (isNaN(targetUserId)) throwError(400, "Invalid user ID.");

        // Pastikan user hanya bisa melihat profilnya sendiri
        if (requestingUserId !== targetUserId) {
            throwError(403, "You can only access your own profile.");
        }

        const profile = await profileRepository.getProfileByUserId(targetUserId);
        if (!profile) throwError(404, "Profile not found.");

        return profile;
    },
};

module.exports = profileService;
