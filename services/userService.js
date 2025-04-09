const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const profileRepository = require("../repositories/profileRepository");
const { createUserSchema, updateUserSchema } = require("../validations/userValidation");
const { throwError } = require("../utils/responseHandler");

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const userService = {
  createUser: async (userData) => {
    const { error } = createUserSchema.validate(userData);
    if (error) throwError(400, error.details[0].message);

    const { username, email, password, role, name, identityNumber, bio, profilePhoto } = userData;

    // Cek apakah email sudah terdaftar
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) throwError(400, "Email is already registered.");

    const hashedPassword = await hashPassword(password);
    const newUser = await userRepository.createUser(username, email, hashedPassword, role);

    // Buat profil hanya jika ada data profil yang diberikan
    let profile = null;
    if (name || identityNumber || bio || profilePhoto) {
      profile = await profileRepository.createProfile({
        userId: newUser.id,
        name,
        identityNumber,
        bio,
        profilePhoto,
      });
    }
    return { user: newUser, profile };
  },

  updateUser: async (id, updateData) => {
    const { error } = updateUserSchema.validate(updateData);
    if (error) throwError(400, error.details[0].message);

    const user = await userRepository.findUserById(id);
    if (!user) throwError(404, "User not found.");

    // Cek apakah email baru sudah digunakan oleh user lain
    if (updateData.email) {
      const emailExists = await userRepository.findUserByEmail(updateData.email);
      if (emailExists && emailExists.id !== id) {
        throwError(400, "Email is already registered by another user.");
      }
    }
    return await userRepository.updateUser(id, updateData);
  },

  deleteUser: async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) throwError(404, "User not found.");

    return await userRepository.deleteUser(id);
  },

  getAllUsers: async () => {
    const users = await userRepository.findAllUsers();
    if (!users || users.length === 0) throwError(404, "No users found.");

    return users;
  },

  getUserById: async (id) => {
    const user = await userRepository.findUserById(id);
    if (!user) throwError(404, "User not found.");

    return user;
  },

  getUsersByRole: async (role) => {
    const users = await userRepository.findUsersByRole(role);
    if (!users || users.length === 0) throwError(404, `No users found with role: ${role}`);

    return users;
  },
};

module.exports = userService;
