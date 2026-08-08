const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getVideosByCourse,
} = require("../controller/video.controller");

const validationMiddleware = require("../middleware/validation.middleware");

const {
    createVideoSchema,
    updateVideoSchema,
} = require("../validations/video.validation");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: Kursga yangi video qo'shish
 *     tags:
 *       - Video
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - title
 *               - duration
 *               - order_number
 *               - video
 *             properties:
 *               course_id:
 *                 type: string
 *                 example: 7c0b5fd0-5d85-4d8e-b7c7-123456789abc
 *               title:
 *                 type: string
 *                 example: 1-dars. Node.js ga kirish
 *               duration:
 *                 type: integer
 *                 example: 720
 *               order_number:
 *                 type: integer
 *                 example: 1
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Video muvaffaqiyatli qo'shildi
 *       400:
 *         description: Noto'g'ri ma'lumot
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       415:
 *         description: Video fayl formati noto'g'ri
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    upload.single("video"),
    validationMiddleware(createVideoSchema),
    createVideo
);

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Barcha videolarni olish
 *     tags:
 *       - Video
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, getAllVideos);

/**
 * @swagger
 * /api/videos/course/{courseId}:
 *   get:
 *     summary: Kurs bo'yicha barcha videolarni olish
 *     tags:
 *       - Video
 *     security:
 *       - bearerAuth: []
 */
router.get(
    "/course/:courseId",
    authMiddleware,
    getVideosByCourse
);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: ID bo'yicha videoni olish
 *     tags:
 *       - Video
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", authMiddleware, getVideoById);

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: Videoni yangilash
 *     tags:
 *       - Video
 *     security:
 *       - bearerAuth: []
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateVideo
);

/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     summary: Videoni o'chirish
 *     tags:
 *       - Video
 *     security:
 *       - bearerAuth: []
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteVideo
);

module.exports = router;