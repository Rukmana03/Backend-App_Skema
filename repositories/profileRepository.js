const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const profileRepository = {
    createProfile: async ({ userId, name, identityNumber, bio, profilePhoto }) => {
        return await prisma.profile.create({
            data: { userId, name, identityNumber, bio, profilePhoto },
        });
    },

    updateProfile: async (userId, data) => {
        const existingProfile = await prisma.profile.findUnique({ where: { userId: Number(userId) } });
        if (!existingProfile) throw new Error("Profile not found");

        return await prisma.profile.update({
            where: { userId: Number(userId) },
            data,
        });
    },

    deleteProfile: async (userId) => {
        return await prisma.profile.delete({
            where: { userId: Number(userId) },
        });
    },

    getProfileByUserId: async (userId) => {
        return await prisma.profile.findUnique({
            where: { userId: Number(userId) },
            include: {
                users: { select: { id: true, username: true, email: true, role: true } },
            },
        });
    },

    getAllProfiles: async () => {
        return await prisma.profile.findMany({
            include: {
                users: { select: { username: true, email: true, role: true } },
            },
        });
    },

    getProfileByIdentityNumber: async (identityNumber) => {
        return prisma.profile.findUnique({
            where: { identityNumber },
        });
    },

};

module.exports = profileRepository;