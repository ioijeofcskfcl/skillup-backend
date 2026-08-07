const progressService = require("../services/progress.service");

const updateProgress = async (req, res, next) => {
    try {
        const progress = await progressService.updateProgress(
            req.user.id,
            req.params.videoId,
            req.body.is_watched,
        );

        return res.status(200).json({
            success: true,
            message: "Progress muvaffaqiyatli yangilandi.",
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};

const getCourseProgress = async (req, res, next) => {
    try {
        const progress = await progressService.getCourseProgress(
            req.user.id,
            req.params.courseId,
        );

        return res.status(200).json({
            success: true,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateProgress,
    getCourseProgress,
};
