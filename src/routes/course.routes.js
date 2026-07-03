const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
} = require("../controller/course.controller");
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
 *               - title
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Node.js Backend
 *               description:
 *                 type: string
 *                 example: 0 dan professional darajagacha
 *               price:
 *                 type: number
 *                 example: 500000
 *               image_url:
 *                 type: string
 *                 example: https://example.com/nodejs.png
 *     responses:
 *       201:
 *         description: Kurs muvaffaqiyatli yaratildi
 */
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createCourse);
/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Barcha kurslarni olish
 *     tags:
 *       - Course
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kurslar ro'yxati
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kurs muvaffaqiyatli yangilandi
 */
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), updateCourse);

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
 *       404:
 *         description: Kurs topilmadi
 */
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteCourse);

module.exports = router;
