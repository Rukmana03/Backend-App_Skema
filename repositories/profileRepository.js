const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const profileRepository = { 
createProfile: async (data) => {
    return prisma.profile.create({ data });
},

getProfileByUserId: async (userId) => {
    return prisma.profile.findUnique({ where: { userId } });
},

updateProfile: async (userId, data) => {
    return prisma.profile.update({ where: { userId }, data });
},

deleteProfile: async (userId) => {
    return prisma.profile.update({
        where: { userId },
        data: { deletedAt: new Date() }, // Soft delete
    });
},
};

module.exports = profileRepository;