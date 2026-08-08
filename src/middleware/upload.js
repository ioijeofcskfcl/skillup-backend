const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,

    limits: {
        fileSize: 500 * 1024 * 1024, // 500 MB
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "video/mp4",
            "video/mpeg",
            "video/quicktime",
            "video/x-msvideo",
            "video/x-matroska",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error(
                "Faqat video fayllarni yuklash mumkin."
            );

            error.statusCode = 415;

            return cb(error, false);
        }

        cb(null, true);
    },
});

module.exports = upload;