const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseVideos
} = require("../controller/course.controller");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    createCourseSchema,
    updateCourseSchema,
} = require("../validations/course.validation");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Yangi kurs yaratish
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - title
 *               - description
 *               - price
 *             properties:
 *               category_id:
 *                 type: string
 *                 example: 7c0b5fd0-5d85-4d8e-b7c7-123456789abc
 *               title:
 *                 type: string
 *                 example: Node.js Backend
 *               description:
 *                 type: string
 *                 example: Professional Node.js Backend kursi
 *               price:
 *                 type: number
 *                 example: 500000
 *               image_url:
 *                 type: string
 *                 example: https://example.com/course.jpg
 *     responses:
 *       201:
 *         description: Kurs muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto'g'ri ma'lumot yuborildi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       403:
 *         description: Ruxsat yo'q
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createCourse,
    validationMiddleware(createCourseSchema)
);
/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Barcha kurslarni olish
 *     tags:
 *       - Course
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
 *         description: Har bir sahifadagi kurslar soni
 *       - in: query
 *         name: category_id
 *         required: false
 *         schema:
 *           type: string
 *           example: d1a4a970-0894-4bfa-b95c-571faa8e169e
 *         description: Kategoriya ID bo'yicha filtrlash
 *     responses:
 *       200:
 *         description: Kurslar ro'yxati muvaffaqiyatli olindi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 */
router.get("/", authMiddleware, getAllCourses);
/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: ID bo'yicha kursni olish
 *     tags:
 *       - Course
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
 *         description: Kurs topildi
 *       404:
 *         description: Kurs topilmadi
 */
router.get("/:id", authMiddleware, getCourseById);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Kursni yangilash
 *     tags:
 *       - Course
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
 *               category_id:
 *                 type: string
 *                 example: 7c0b5fd0-5d85-4d8e-b7c7-123456789abc
 *               title:
 *                 type: string
 *                 example: Node.js Backend
 *               description:
 *                 type: string
 *                 example: Professional Node.js Backend kursi
 *               price:
 *                 type: number
 *                 example: 500000
 *               image_url:
 *                 type: string
 *                 example: https://example.com/course.jpg
 *     responses:
 *       200:
 *         description: Kurs muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto'g'ri ma'lumot yuborildi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       403:
 *         description: Ruxsat yo'q
 *       404:
 *         description: Kurs topilmadi
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateCourse,
    validationMiddleware(updateCourseSchema)
);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Kursni o'chirish
 *     tags:
 *       - Course
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
 *         description: Kurs muvaffaqiyatli o'chirildi
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       403:
 *         description: Ruxsat yo'q
 *       404:
 *         description: Kurs topilmadi
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteCourse
);
/**
 * @swagger
 * /api/courses/{id}/videos:
 *   get:
 *     summary: Kurs videolarini olish
 *     tags:
 *       - Course
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
 *         description: Kurs videolari
 *       403:
 *         description: Siz ushbu kursni sotib olmagansiz
 *       404:
 *         description: Kurs topilmadi
 */
router.get(
    "/:id/videos",
    authMiddleware,
    getCourseVideos,
);

module.exports = router;