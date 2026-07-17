const adminService = require("../services/admin.service");

const createAdmin = async (req, res, next) => {
    try {
        const admin = await adminService.createAdmin(req.body);

        return res.status(201).json({
            success: true,
            message: "Admin muvaffaqiyatli yaratildi.",
            data: admin,
        });
    } catch (error) {
        next(error);
    }
};
const getAllAdmins = async (req, res, next) => {
    try {
        const admins = await adminService.getAllAdmins();

        return res.status(200).json({
            success: true,
            data: admins,
        });
    } catch (error) {
        next(error);
    }
};
const getAdminById = async (req, res, next) => {
    try {
        const admin = await adminService.getAdminById(req.params.id);

        return res.status(200).json({
            success: true,
            data: admin,
        });
    } catch (error) {
        next(error);
    }
};
const updateAdmin = async (req, res, next) => {
    try {
        const admin = await adminService.updateAdmin(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Admin muvaffaqiyatli yangilandi.",
            data: admin,
        });
    } catch (error) {
        next(error);
    }
};
const deleteAdmin = async (req, res, next) => {
    try {
        await adminService.deleteAdmin(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Admin muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};
