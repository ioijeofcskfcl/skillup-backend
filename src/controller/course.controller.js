const courseService = require("../services/course.service");

const createCourse = async (req, res, next) => {
    try {
        const course = await courseService.createCourse({
            ...req.body,
            image: req.file,
            created_by: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Kurs muvaffaqiyatli yaratildi.",
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

const getAllCourses = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const category_id = req.query.category_id || "";
        const search = req.query.search || "";
        const sort = req.query.sort || "newest";

        const courses = await courseService.getAllCourses(
            page,
            limit,
            category_id,
            search,
            sort
        );

        return res.status(200).json({
            success: true,
            ...courses,
        });
    } catch (error) {
        next(error);
    }
};

const getCourseById = async (req, res, next) => {
    try {
        const course = await courseService.getCourseById(req.params.id);

        return res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const course = await courseService.updateCourse(
            req.params.id,
            {
                ...req.body,
                image: req.file,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Kurs muvaffaqiyatli yangilandi.",
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        await courseService.deleteCourse(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Kurs muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        next(error);
    }
};

const getCourseVideos = async (req, res, next) => {
    try {
        const videos = await courseService.getCourseVideos(
            req.params.id,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: videos,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseVideos,
};