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
console.log("CREATE VIDEO:", typeof createVideo);

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
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Sahifa raqami
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Bir sahifada nechta video chiqishi
 *
 *       - in: query
 *         name: course_id
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Kurs ID bo'yicha filter
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Video nomi bo'yicha qidirish
 *
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - order_asc
 *             - order_desc
 *             - title_asc
 *             - title_desc
 *             - newest
 *             - oldest
 *           default: order_asc
 *         description: Videolarni saralash
 *
 *     responses:
 *       200:
 *         description: Videolar muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           course_id:
 *                             type: string
 *                             format: uuid
 *                           course_title:
 *                             type: string
 *                             example: Node.js Backend
 *                           title:
 *                             type: string
 *                             example: 1-dars. Node.js ga kirish
 *                           video_url:
 *                             type: string
 *                             format: uri
 *                           duration:
 *                             type: integer
 *                             example: 720
 *                           order_number:
 *                             type: integer
 *                             example: 1
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
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
 *           format: uuid
 *         description: Kurs ID
 *
 *     responses:
 *       200:
 *         description: Kurs videolari muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       course_id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                         example: 1-dars. Node.js ga kirish
 *                       video_url:
 *                         type: string
 *                         format: uri
 *                       duration:
 *                         type: integer
 *                         example: 720
 *                       order_number:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *
 *       400:
 *         description: Kurs topilmadi
 *
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
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
 *           format: uuid
 *         description: Video ID
 *
 *     responses:
 *       200:
 *         description: Video muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     course_id:
 *                       type: string
 *                       format: uuid
 *                     course_title:
 *                       type: string
 *                       example: Node.js Backend
 *                     title:
 *                       type: string
 *                       example: 1-dars. Node.js ga kirish
 *                     video_url:
 *                       type: string
 *                       format: uri
 *                     duration:
 *                       type: integer
 *                       example: 720
 *                     order_number:
 *                       type: integer
 *                       example: 1
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *
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
 *           format: uuid
 *         description: Video ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_id:
 *                 type: string
 *                 format: uuid
 *                 example: c37f02b2-b56a-4b21-86eb-752d5795a127
 *               title:
 *                 type: string
 *                 example: 2-dars. Express.js ga kirish
 *               duration:
 *                 type: integer
 *                 example: 900
 *               order_number:
 *                 type: integer
 *                 example: 2
 *
 *     responses:
 *       200:
 *         description: Video muvaffaqiyatli yangilandi
 *
 *       400:
 *         description: Noto'g'ri ma'lumot
 *
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *
 *       404:
 *         description: Video topilmadi
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
 *           format: uuid
 *         description: Video ID
 *
 *     responses:
 *       200:
 *         description: Video muvaffaqiyatli o'chirildi
 *
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *
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