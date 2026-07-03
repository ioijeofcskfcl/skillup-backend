const express = require("express");
const router = express.Router();

const {
    createVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    getVideosByCourse,
} = require("../controller/video.controller");

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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - title
 *               - video_url
 *             properties:
 *               course_id:
 *                 type: string
 *                 example: 7c0b5fd0-5d85-4d8e-b7c7-123456789abc
 *               title:
 *                 type: string
 *                 example: 1-dars. Node.js ga kirish
 *               video_url:
 *                 type: string
 *                 example: https://example.com/video.mp4
 *               duration:
 *                 type: integer
 *                 example: 720
 *               order_number:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Video muvaffaqiyatli qo'shildi
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
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
 *     responses:
 *       200:
 *         description: Video ro'yxati
 */
router.get(
    "/",
    authMiddleware,
    getAllVideos
);

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
router.get(
    "/:id",
    authMiddleware,
    getVideoById
);

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
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteVideo
);

module.exports = router;