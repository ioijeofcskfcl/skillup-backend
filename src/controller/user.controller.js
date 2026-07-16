const userService = require("../services/user.service");

const getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = req.query.search || "";
        const role = req.query.role || "";
        const is_active = req.query.is_active ?? "";
        const sort = req.query.sort || "newest";

        const users = await userService.getAllUsers(
            page,
            limit,
            search,
            role,
            is_active,
            sort
        );

        return res.status(200).json({
            success: true,
            ...users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
const getProfile = async (req, res) => {
    try {
        const profile = await userService.getProfile(req.user.id);

        return res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    getAllUsers,
    getUserById,
    getProfile,
};
