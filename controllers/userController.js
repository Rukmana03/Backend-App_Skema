const userService = require("../services/userService");
const { errorResponse, successResponse, } = require("../utils/responeHandler");

const userController = {
  createUser: async (req, res) => {
    try {
      // Pastikan hanya Admin yang bisa membuat akun
      if (req.user.role !== "Admin") {
        return errorResponse(res, 403, "Only admins can create accounts.");
      }

      const { username, email, password, role } = req.body;
      const newUser = await userService.createUser({ username, email, password, role });

      return successResponse(res, 201, "User registered successfully!", newUser);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message || "Internal Server Error");
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      successResponse(res, 200, "Users retrieved successfully", users);
    } catch (error) {
      errorResponse(res, error.status || 500, error.message);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await userService.getUserById(parseInt(req.params.id, 10));
      successResponse(res, 200, "User retrieved successfully", user);
    } catch (error) {
      errorResponse(res, error.status || 500, error.message);
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const updatedUser = await userService.updateUser(userId, req.body);
      successResponse(res, 200, "User updated successfully", updatedUser);
    } catch (error) {
      errorResponse(res, error.status || 500, error.message);
    }
  },

  deleteUser: async (req, res) => {
    try {
      await userService.deleteUser(parseInt(req.params.id, 10));
      successResponse(res, 200, "User deleted successfully");
    } catch (error) {
      errorResponse(res, error.status || 500, error.message);
    }
  },

  getUsersByRole: async (req, res) => {
    try {
      let { role } = req.params; // Gunakan let agar bisa diubah
      role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

      console.log("Role after formatting:", role); // Debug log

      const users = await userService.getUsersByRole(role);

      if (!users || users.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No users found with role: ${role}`,
          error: null,
        });
      }

      successResponse(res, 200, "Users fetched successfully", users);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      errorResponse(res, 500, "Users fetched not success", error.message);
    }
  },

};

module.exports = userController;