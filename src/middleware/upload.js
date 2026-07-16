const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,

    limits: {
        fileSize: 1024 * 1024 * 500, // 500 MB
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
            return cb(new Error("Faqat video fayl yuklash mumkin."));
        }

        cb(null, true);
    },
});

module.exports = upload;