const express = require("express");
const router = express.Router();
const {
    login,
    register,
    verify,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
} = require("../controller/auth.controller");
const validationMiddleware = require("../middleware/validation.middleware");

const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} = require("../validations/auth.validation");
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Foydalanuvchini ro'yxatdan o'tkazish
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "Ogabek Jumanazarov"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ogabek@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Ogabek123"
 *     responses:
 *       200:
 *         description: Tasdiqlash kodi emailga yuborildi
 *       400:
 *         description: Noto'g'ri ma'lumot
 *       409:
 *         description: Email allaqachon mavjud
 */

router.post("/register", validationMiddleware(registerSchema), register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Tizimga kirish
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *               password:
 *                 type: string
 *                 example: "111111"
 *     responses:
 *       200:
 *         description: Kirish muvaffaqiyatli
 */
router.post("/login", validationMiddleware(loginSchema), login);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Tasdiqlash kodi orqali foydalanuvchini tasdiqlash
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli yaratildi
 *       400:
 *         description: Kod noto'g'ri yoki muddati tugagan
 */
router.post("/verify", verify);
/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Tasdiqlash kodini qayta yuborish
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *     responses:
 *       200:
 *         description: Yangi tasdiqlash kodi yuborildi
 */
router.post("/resend-otp", resendOtp);
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Parolni tiklash uchun kod yuborish
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *     responses:
 *       200:
 *         description: Parolni tiklash kodi yuborildi
 */
router.post(
    "/forgot-password",
    validationMiddleware(forgotPasswordSchema),
    forgotPassword,
);
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Parolni yangilash
 *     tags:
 *       - Autentifikatsiya
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jumanazarovogabek773@gmail.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *               password:
 *                 type: string
 *                 example: "11111111"
 *     responses:
 *       200:
 *         description: Parol muvaffaqiyatli yangilandi
 */
router.post(
    "/reset-password",
    validationMiddleware(resetPasswordSchema),
    resetPassword,
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Tizimdan chiqish
 *     tags:
 *       - Autentifikatsiya
 *     responses:
 *       200:
 *         description: Tizimdan muvaffaqiyatli chiqildi
 */
router.post("/logout", logout);

module.exports = router;
