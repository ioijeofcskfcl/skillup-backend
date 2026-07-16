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
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    upload.single("video"),
    createVideo,
    validationMiddleware(createVideoSchema),
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
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Har bir sahifadagi videolar soni
 *       - in: query
 *         name: course_id
 *         required: false
 *         schema:
 *           type: string
 *         description: Kurs ID bo'yicha filter
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Video nomi bo'yicha qidirish
 *     responses:
 *       200:
 *         description: Videolar ro'yxati muvaffaqiyatli olindi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
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
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kurs videolari muvaffaqiyatli olindi
 *       404:
 *         description: Kurs topilmadi
 */
router.get("/course/:courseId", authMiddleware, getVideosByCourse);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: ID bo'yicha videoni olish
 *     tags:
 *       - Video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video topildi
 *       404:
 *         description: Video topilmadi
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: string
 *               title:
 *                 type: string
 *               video_url:
 *                 type: string
 *               duration:
 *                 type: integer
 *               order_number:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Video muvaffaqiyatli yangilandi
 */
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateVideo);

/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     summary: Videoni o'chirish
 *     tags:
 *       - Video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video muvaffaqiyatli o'chirildi
 *       404:
 *         description: Video topilmadi
 */
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteVideo);

module.exports = router;
