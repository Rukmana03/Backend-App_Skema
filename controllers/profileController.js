const profileService = require("../services/profileService");

const profileController = {
createProfile: async (req, res, next) => {
    try {
        const { name, identityNumber, bio, profilePhoto } = req.body;
        const userId = req.user.id; // Ambil userId dari token JWT
        const response = await profileService.createProfile({ userId, name, identityNumber, bio, profilePhoto });
        res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
},

getProfile: async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await profileService.getProfile(userId);
        res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
},

updateProfile: async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await profileService.updateProfile(userId, req.body);
        res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
},

deleteProfile: async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await profileService.deleteProfile(userId);
        res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
},
};

module.exports = profileController;
