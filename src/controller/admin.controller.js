const adminService = require("../services/admin.service");

const createAdmin = async (req, res) => {
    try {
        const admin = await adminService.createAdmin(req.body);

        return res.status(201).json({
            success: true,
            message: "Admin muvaffaqiyatli yaratildi.",
            data: admin,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminService.getAllAdmins();

        return res.status(200).json({
            success: true,
            data: admins,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getAdminById = async (req, res) => {
    try {
        const admin = await adminService.getAdminById(req.params.id);

        return res.status(200).json({
            success: true,
            data: admin,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
const updateAdmin = async (req, res) => {
    try {
        const admin = await adminService.updateAdmin(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Admin muvaffaqiyatli yangilandi.",
            data: admin,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const deleteAdmin = async (req, res) => {
    try {
        await adminService.deleteAdmin(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Admin muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
};