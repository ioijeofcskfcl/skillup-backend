const videoService = require("../services/video.service");

const createVideo = async (req, res, next) => {
    try {
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
        const {
            page = 1,
            limit = 10,
            course_id = "",
            search = "",
            sort = "order_asc",
        } = req.query;

        const result = await videoService.getAllVideos(
            Number(page),
            Number(limit),
            course_id,
            search,
            sort,
        );

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

const getVideoById = async (req, res, next) => {
    try {
        const video = await videoService.getVideoById(
            req.params.id,
        );

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
        const video = await videoService.updateVideo(
            req.params.id,
            req.body,
        );

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