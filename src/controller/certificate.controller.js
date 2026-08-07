const certificateService = require("../services/certificate.service");

const getCertificate = async (req, res, next) => {
    try {
        const certificate = await certificateService.getCertificate(
            req.user.id,
            req.params.courseId,
        );

        return res.status(200).json({
            success: true,
            message: "Sertifikat olish mumkin.",
            data: certificate,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCertificate,
};