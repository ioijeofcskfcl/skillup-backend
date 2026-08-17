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
const imageUpload = require("../middleware/imageUpload");

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - title
 *               - description
 *               - price
 *               - image
 *             properties:
 *               category_id:
 *                 type: string
 *                 format: uuid
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
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Kurs rasmi
 *     responses:
 *       201:
 *         description: Kurs muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto'g'ri ma'lumot yoki rasm yuklanmagan
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       403:
 *         description: Ruxsat yo'q
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    imageUpload.single("image"),
    validationMiddleware(createCourseSchema),
    createCourse
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
 *           format: uuid
 *         description: Kurs ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: string
 *                 format: uuid
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
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Yangi kurs rasmi
 *     responses:
 *       200:
 *         description: Kurs muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto'g'ri ma'lumot
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
    imageUpload.single("image"),
    validationMiddleware(updateCourseSchema),
    updateCourse
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