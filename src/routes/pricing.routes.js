const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    createPricingSchema,
    updatePricingSchema,
} = require("../validations/pricing.validation");

const {
    createPricing,
    getAllPricing,
    getPricingById,
    updatePricing,
    deletePricing,
} = require("../controller/pricing.controller");

/**
 * @swagger
 * /api/pricing:
 *   post:
 *     summary: Pricing yaratish (Admin)
 *     tags:
 *       - Pricing
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
 *                 example: Premium
 *               price:
 *                 type: number
 *                 example: 199000
 *               description:
 *                 type: string
 *                 example: Premium tarif
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Barcha videolar
 *                   - Quizlar
 *                   - Sertifikat
 *     responses:
 *       201:
 *         description: Pricing muvaffaqiyatli yaratildi
 */
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validationMiddleware(createPricingSchema),
    createPricing,
);

/**
 * @swagger
 * /api/pricing:
 *   get:
 *     summary: Barcha pricinglarni olish
 *     tags:
 *       - Pricing
 *     responses:
 *       200:
 *         description: Pricinglar ro'yxati
 */
router.get(
    "/",
    getAllPricing,
);

/**
 * @swagger
 * /api/pricing/{id}:
 *   get:
 *     summary: Bitta pricingni olish
 *     tags:
 *       - Pricing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pricing topildi
 *       404:
 *         description: Pricing topilmadi
 */
router.get(
    "/:id",
    getPricingById,
);

/**
 * @swagger
 * /api/pricing/{id}:
 *   put:
 *     summary: Pricingni yangilash (Admin)
 *     tags:
 *       - Pricing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Pricing muvaffaqiyatli yangilandi
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validationMiddleware(updatePricingSchema),
    updatePricing,
);

/**
 * @swagger
 * /api/pricing/{id}:
 *   delete:
 *     summary: Pricingni o'chirish (Admin)
 *     tags:
 *       - Pricing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Pricing muvaffaqiyatli o'chirildi
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deletePricing,
);

module.exports = router;