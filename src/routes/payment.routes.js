const express = require("express");
const router = express.Router();

const {
    createPayment,
    getMyCourses,
} = require("../controller/payment.controller");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    createPaymentSchema,
} = require("../validations/payment.validation");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Kurs uchun to'lov yaratish
 *     tags:
 *       - Payment
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
 *               - payment_method
 *             properties:
 *               course_id:
 *                 type: string
 *                 example: 7c0b5fd0-5d85-4d8e-b7c7-123456789abc
 *               payment_method:
 *                 type: string
 *                 enum:
 *                   - CLICK
 *                   - PAYME
 *                   - VISA
 *                 description: To'lov usuli
 *                 example: CLICK
 *     responses:
 *       201:
 *         description: To'lov muvaffaqiyatli yaratildi
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
    roleMiddleware("USER"),
    createPayment,
    validationMiddleware(createPaymentSchema)
);

/**
 * @swagger
 * /api/payments/my-courses:
 *   get:
 *     summary: Foydalanuvchi sotib olgan kurslarni olish
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sotib olingan kurslar ro'yxati
 *       401:
 *         description: Token mavjud emas yoki noto'g'ri
 *       403:
 *         description: Ruxsat yo'q
 */
router.get(
    "/my-courses",
    authMiddleware,
    roleMiddleware("USER"),
    getMyCourses
);

module.exports = router;