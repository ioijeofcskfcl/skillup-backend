const videoService = require("../services/video.service");
const AppError = require("../utils/utilsAppError");

const createVideo = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new AppError("Video yuklanmadi.", 400);
        }

        const video = await videoService.createVideo({
            course_id: req.body.course_id,
            title: req.body.title,
            duration: req.body.duration,
            order_number: req.body.order_number,
            file: req.file,
        });

        return res.status(201).json({
            success: true,
            message: "Video muvaffaqiyatli qo'shildi.",
            data: video,
        });
    } catch (error) {
        next(error);
    }
};
const getAllVideos = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const course_id = req.query.course_id || "";
        const search = req.query.search || "";
        const sort = req.query.sort || "order_asc";

        const videos = await videoService.getAllVideos(
            page,
            limit,
            course_id,
            search,
            sort,
        );

        return res.status(200).json({
            success: true,
            ...videos,
        });
    } catch (error) {
        next(error);
    }
};
const getVideoById = async (req, res, next) => {
    try {
        const video = await videoService.getVideoById(req.params.id);

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        next(error);
    }
};
const updateVideo = async (req, res, next) => {
    try {
        const video = await videoService.updateVideo(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Video muvaffaqiyatli yangilandi.",
            data: video,
        });
    } catch (error) {
        next(error);
    }
};
const deleteVideo = async (req, res, next) => {
    try {
        await videoService.deleteVideo(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Video muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        next(error);
    }
};
const getVideosByCourse = async (req, res, next) => {
    try {
        const videos = await videoService.getVideosByCourse(
            req.params.courseId,
        );

        return res.status(200).json({
            success: true,
            count: videos.length,
            data: videos,
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getVideosByCourse,
};
