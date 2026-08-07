const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    createMentorSchema,
    updateMentorSchema,
} = require("../validations/mentor.validation");

const {
    createMentor,
    getAllMentors,
    getMentorById,
    updateMentor,
    deleteMentor,
} = require("../controller/mentor.controller");

/**
 * @swagger
 * /api/mentors:
 *   post:
 *     summary: Yangi mentor yaratish (Admin)
 *     tags:
 *       - Mentors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Ali Valiyev
 *               profession:
 *                 type: string
 *                 example: Backend Developer
 *               bio:
 *                 type: string
 *                 example: Node.js va PostgreSQL bo'yicha mentor
 *               image_url:
 *                 type: string
 *                 example: https://example.com/mentor.jpg
 *     responses:
 *       201:
 *         description: Mentor muvaffaqiyatli yaratildi
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validationMiddleware(createMentorSchema),
    createMentor,
);

/**
 * @swagger
 * /api/mentors:
 *   get:
 *     summary: Barcha mentorlarni olish
 *     tags:
 *       - Mentors
 *     responses:
 *       200:
 *         description: Mentorlar ro'yxati
 */
router.get(
    "/",
    getAllMentors,
);

/**
 * @swagger
 * /api/mentors/{id}:
 *   get:
 *     summary: Bitta mentorni olish
 *     tags:
 *       - Mentors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Mentor topildi
 *       404:
 *         description: Mentor topilmadi
 */
router.get(
    "/:id",
    getMentorById,
);

/**
 * @swagger
 * /api/mentors/{id}:
 *   put:
 *     summary: Mentorni yangilash (Admin)
 *     tags:
 *       - Mentors
 *     security:
 *       - bearerAuth: []
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validationMiddleware(updateMentorSchema),
    updateMentor,
);

/**
 * @swagger
 * /api/mentors/{id}:
 *   delete:
 *     summary: Mentorni o'chirish (Admin)
 *     tags:
 *       - Mentors
 *     security:
 *       - bearerAuth: []
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteMentor,
);

module.exports = router;