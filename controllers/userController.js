const userService = require("../services/userService");
const { errorResponse, successResponse } = require("../utils/responseHandler");

const userController = {
  createUser: async (req, res) => {
    try {
      const newUser = await userService.createUser(req.body);
      successResponse(res, 201, "User created successfully", newUser);
    } catch (error) {
      errorResponse(res, error.status || 500, error.message);
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const updatedUser = await userService.updateUser(userId, req.body);
      return successResponse(res, 200, "User updated successfully.", updatedUser);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  deleteUser: async (req, res) => {
    try {
      await userService.deleteUser(Number(req.params.id));
      return successResponse(res, 200, "User deleted successfully.");
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      return successResponse(res, 200, "Users retrieved successfully.", users);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await userService.getUserById(Number(req.params.id));
      return successResponse(res, 200, "User retrieved successfully.", user);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },

  getUsersByRole: async (req, res) => {
    try {
      let { role } = req.params;
      role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

      const users = await userService.getUsersByRole(role);
      return successResponse(res, 200, "Users retrieved successfully.", users);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  },
};

module.exports = userController;
