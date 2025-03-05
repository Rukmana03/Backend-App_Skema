const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");
const { throwError } = require("../utils/responeHandler");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const createUser = async ({ username, email, password, role }) => {
  console.log("Received role:", role);

  if (!username || !email || !password || !role) {
    throwError(400, "All fields are required");
  }

  // Pastikan role hanya bisa "Teacher" atau "Student"
  const validRoles = ["Teacher", "Student"];
  if (!validRoles.includes(role)) {
    throwError(400, "Only Teacher or Student roles are allowed");
  }

  // Cek apakah email sudah ada di database
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) throwError(400, "Email is already registered");

  const hashedPassword = await hashPassword(password);

  // Guru dan murid tidak perlu verifikasi email
  return await userRepository.createUser(username, email, hashedPassword, role);
};

const updateUser = async (id, updateData) => {
  const user = await userRepository.findUserById(id);
  if (!user) throwError(404, "User not found");

  return await userRepository.updateUser(id, updateData);
};

const deleteUser = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) throwError(404, "User not found");

  return await userRepository.deleteUser(id);
};

const getAllUsers = async () => {
  return await userRepository.findAllUsers();
};

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) throwError(404, "User not found");
  return user;
};

const getUsersByRole = async (role) => {
  console.log("Fetching users with role:", role); // Debug log
  return await userRepository.findUsersByRole(role);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
};
