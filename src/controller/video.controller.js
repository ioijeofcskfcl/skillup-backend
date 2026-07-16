const videoService = require("../services/video.service");

const createVideo = async (req, res) => {
    try {
        const video = await videoService.createVideo(req.body);

        return res.status(201).json({
            success: true,
            message: "Video muvaffaqiyatli qo'shildi.",
            data: video,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const getAllVideos = async (req, res) => {
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
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getVideoById = async (req, res) => {
    try {
        const video = await videoService.getVideoById(req.params.id);

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
const updateVideo = async (req, res) => {
    try {
        const video = await videoService.updateVideo(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Video muvaffaqiyatli yangilandi.",
            data: video,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const deleteVideo = async (req, res) => {
    try {
        await videoService.deleteVideo(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Video muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
const getVideosByCourse = async (req, res) => {
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
        return res.status(404).json({
            success: false,
            message: error.message,
        });
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
