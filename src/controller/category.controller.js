const categoryService = require("../services/category.service");

const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);

        res.status(201).json({
            success: true,
            message: "Kategoriya muvaffaqiyatli yaratildi.",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};
const getAllCategories = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const search = req.query.search || "";
        const sort = req.query.sort || "newest";

        const categories = await categoryService.getAllCategories(
            page,
            limit,
            search,
            sort,
        );

        return res.status(200).json({
            success: true,
            ...categories,
        });
    } catch (error) {
        next(error);
    }
};
const getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        next(error);
    }
};
const updateCategory = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(
            req.params.id,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "Kategoriya muvaffaqiyatli yangilandi.",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};
const deleteCategory = async (req, res, next) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);

        res.status(200).json({
            success: true,
            message: "Kategoriya muvaffaqiyatli o'chirildi.",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
