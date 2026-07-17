const userService = require("../services/user.service");
const AppError = require("../utils/utilsAppError");

const getAllUsers = async (req, res, next) => {
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
            sort,
        );

        return res.status(200).json({
            success: true,
            ...users,
        });
    } catch (error) {
        next(error);
    }
};
const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
const getProfile = async (req, res, next) => {
    try {
        const profile = await userService.getProfile(req.user.id);

        return res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    getAllUsers,
    getUserById,
    getProfile,
};
