const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const { hashPassword, comparePassword } = require("../utils/hashPassword");

async function registerUser(email, password, role, name, identity_number) {
    const exitingUser = await prisma.user.findUnique({ where: { email } });
    if (exitingUser) throw new Error("Email sudah terdaftar");

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
            Profile: {
                create: {
                    name,
                    identity_number: identity_number || "",
                },
            },
    },
    
});

return newUser;

}

async function loginUser(email, password) {
    const user = await prisma.user.findUnique({where: {email}, include: {Profile: true}});
    if (!user) throw new Error("User tidak ditemukan");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Password salah");

    return user;
}

async function resetPassword(email, newPassword) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User tidak ditemukan");

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
    });

    return "Password berhasil direset";
}

module.exports = { registerUser, loginUser, resetPassword };