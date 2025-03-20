const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const profileRepository = {
    createProfile: async (data) => {
        return prisma.profile.create({ data });
    },

    getProfileByUserId: async (userId) => {
        return prisma.profile.findFirst({
            where: { userId, deletedAt: null }, // Hanya ambil yang belum dihapus
        });
    },

    updateProfile: async (userId, data) => {
        const existingProfile = await prisma.profile.findFirst({ where: { userId, deletedAt: null } });
        if (!existingProfile) throw new Error("Profile not found");

        return prisma.profile.update({
            where: { userId },
            data,
        });
    },

    deleteProfile: async (userId) => {
        return prisma.profile.delete({
            where: { userId } // Soft delete
        });
    },
};

module.exports = profileRepository;