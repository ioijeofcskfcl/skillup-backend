const multer = require("multer");

const storage = multer.memoryStorage();

const imageUpload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Faqat rasm fayl yuklash mumkin."));
        }
    },
});

module.exports = imageUpload;