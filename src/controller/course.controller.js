const courseService = require("../services/course.service");

const createCourse = async (req, res) => {
    try {
        const course = await courseService.createCourse({
            ...req.body,
            created_by: req.user.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Kurs muvaffaqiyatli yaratildi.",
            data: course,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllCourses();

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getCourseById = async (req, res) => {
    try {
        const course = await courseService.getCourseById(req.params.id);

        return res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
const updateCourse = async (req, res) => {
    try {
        const course = await courseService.updateCourse(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Kurs muvaffaqiyatli yangilandi.",
            data: course,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
const deleteCourse = async (req, res) => {
    try {
        await courseService.deleteCourse(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Kurs muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};